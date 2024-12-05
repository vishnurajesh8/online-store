from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Products, Variants, SubVariants
from .serializers import ProductSerializer, VariantSerializer, SubVariantSerializer
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
@api_view(['POST'])
def login_view(request):
    """
    Login view for JWT authentication using email and password.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        if not check_password(password, user.password):
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {"error": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Retrieve the profile of the logged-in user.
    """
    user = request.user  # This will be the authenticated user
    return Response(
        {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        status=status.HTTP_200_OK
    )


# ----------------user registration section-----------------------------

@api_view(['POST'])
def register_view(request):
    """
    Register a new user.
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if not username or not email or not password:
        return Response(
            {"error": "Username, email, and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "A user with this email already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "A user with this username already exists."},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create(
        username=username,
        email=email,
        password=make_password(password),
        first_name=first_name,
        last_name=last_name
    )

    return Response(
        {
            "message": "User registered successfully.",
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home_products(request):
    total_products_count = Products.objects.filter(CreatedUser=request.user).count()
    total_stock_count = SubVariants.objects.filter(variant__product__CreatedUser=request.user).aggregate(total_stock=Sum('stock'))['total_stock'] or 0
    five_months_ago = timezone.now() - timedelta(days=2 * 30)
    new_products_count = Products.objects.filter(CreatedDate__gte=five_months_ago,CreatedUser=request.user).count()
    low_stock_subvariants = SubVariants.objects.filter(stock__lt=10, variant__product__CreatedUser=request.user)
    response_data = []
    for sub_variant in low_stock_subvariants:

        product = sub_variant.variant.product


        data = {
            'ProductID': product.id,
            'ProductName': product.ProductName,
            'SubVariantID': sub_variant.id,
            'Option': sub_variant.option,
            'Stock': sub_variant.stock,
            'CreatedAt': sub_variant.created_at,
            'UpdatedAt': sub_variant.updated_at
        }


        response_data.append(data)


    low_stock_count = len(low_stock_subvariants)


    result = {
        'total_products_count': total_products_count,
        'total_stock_count': total_stock_count,
        'new_products_count': new_products_count,
        'low_stock_count': low_stock_count,
        'low_stock_subvariants': response_data
    }

    return Response(result, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    """
    API view to add a new product. Excludes variants in the request.
    """
    if request.method == 'POST':
        # Serialize the product data (without variants)
        print(request.data)
        request.data['CreatedUser']= request.user.id
        serializer = ProductSerializer(data=request.data)


        if serializer.is_valid():
            # Save the product if the data is valid
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_list_view(request):
    """
    List all products with variants and subvariants.
    """
    products = Products.objects.filter(CreatedUser=request.user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def product_single_view(request,product_id):
    """
    List all products with variants and subvariants.
    """
    try:
        products = Products.objects.get( id=product_id)
        serializer = ProductSerializer(products, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Products.DoesNotExist:
        return  Response({"error":"product not found" },status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_subvariant(request, subvariant_id):
    try:
        subvariant = SubVariants.objects.get(id=subvariant_id)
    except SubVariants.DoesNotExist:
        return Response({"detail": "Sub-variant not found."}, status=status.HTTP_404_NOT_FOUND)

    # Update the fields
    subvariant.option = request.data.get('option', subvariant.option)
    subvariant.stock = request.data.get('stock', subvariant.stock)
    subvariant.save()

    serializer = SubVariantSerializer(subvariant)
    return Response(serializer.data)


# Delete a sub-variant
@api_view(['DELETE'])
def delete_subvariant(request, subvariant_id):
    try:
        subvariant = SubVariants.objects.get(id=subvariant_id)
    except SubVariants.DoesNotExist:
        return Response({"detail": "Sub-variant not found."}, status=status.HTTP_404_NOT_FOUND)

    subvariant.delete()
    return Response({"detail": "Sub-variant deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# Add a new sub-variant
@api_view(['POST'])
def add_subvariant(request, product_id):
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

    variant_id = request.data.get('variantId')
    option = request.data.get('option')
    stock = request.data.get('stock')

    try:
        variant = Variants.objects.get(id=variant_id)
    except Variants.DoesNotExist:
        return Response({"detail": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)

    subvariant = SubVariants.objects.create(
        variant=variant,
        option=option,
        stock=stock,
    )


    product.variants.add(variant)

    serializer = SubVariantSerializer(subvariant)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def add_variant(request, product_id):
    try:

        product = Products.objects.get(id=product_id)

       

        # Create a variant instance
        variant_data = request.data.get('options')
        print(variant_data)
        variant_name = request.data.get('name')
        print(variant_name)

        # Create the variant
        variant = Variants.objects.create(product=product, name=variant_name)

        # Now handle the sub_variants if they are part of the variant creation

        for sub_variant in variant_data:
            option = sub_variant.get('option')
            stock = sub_variant.get('stock', 0)

            # Create SubVariant instance
            SubVariants.objects.create(variant=variant, option=option, stock=stock)

        # Serialize the created variant and return the response
        variant_serializer = VariantSerializer(variant)
        return Response(variant_serializer.data, status=status.HTTP_201_CREATED)

    except Products.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)