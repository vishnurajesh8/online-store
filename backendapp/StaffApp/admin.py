from django.contrib import admin
from  .models import  Products,Variants,SubVariants
# Register your models here.
admin.site.register(Products)
admin.site.register(Variants)
admin.site.register(SubVariants)