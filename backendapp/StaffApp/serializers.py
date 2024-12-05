# serializers.py

from rest_framework import serializers
from .models import Products, Variants, SubVariants
from versatileimagefield.fields import VersatileImageField


class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariants
        fields = ['id', 'option', 'stock', 'created_at', 'updated_at']


class VariantSerializer(serializers.ModelSerializer):
    sub_variants = SubVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Variants
        fields = ['id', 'name', 'sub_variants', 'created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate',
                  'UpdatedDate', 'CreatedUser', 'IsFavourite', 'Active', 'HSNCode', 'TotalStock', 'variants']
