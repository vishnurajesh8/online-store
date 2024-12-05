from django.urls import path
from . import views

urlpatterns = [
    # User login endpoint
    path('login/', views.login_view, name='login'),

    # User registration endpoint
    path('register/', views.register_view, name='register'),

    # User profile endpoint (requires authentication)
    path('api/dashboard/', views.home_products, name='user-profile'),
    path('products/', views.product_list_view, name='product-list'),
    path('api/products/create/', views.add_product, name='product-create'),
    path('api/products/<uuid:product_id>/', views.product_single_view, name='product-single'),
    path('api/sub-variants/<int:subvariant_id>/', views.update_subvariant, name='update_subvariant'),
    path('api/sub-variants/<int:subvariant_id>/delete/', views.delete_subvariant, name='delete_subvariant'),
    path('api/products/<uuid:product_id>/add_subvariant/', views.add_subvariant, name='add_subvariant'),
    path('api/products/<uuid:product_id>/add_variant/', views.add_variant, name='add_variant'),

]
