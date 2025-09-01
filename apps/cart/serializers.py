from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSKUSerializer, ProductSerializer
from products.models import Product, ProductAttribute, ProductSKU

class CartItemSerializer(serializers.ModelSerializer):

    product_sku = ProductSKUSerializer(read_only = True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem

        fields = [
            'id',
            'product_sku',
            'quantity',
            'total_price'
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many = True, read_only = True)
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'grand_total'
        ]

    def get_grand_total(self, obj):
        return sum(item.total_price for item in obj.items.all())


class AddItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    color = serializers.CharField()
    size = serializers.CharField()
    quantity = serializers.IntegerField(min_value = 1)

    def validate(self, data):
        
        try:
            product = Product.objects.get(id = data.get("product_id"))
            size_attr = ProductAttribute.objects.get(name = data.get("size"))
            color_attr = ProductAttribute.objects.get(name = data.get("color"))
            
            product_sku = ProductSKU.objects.get(
                product = product,
                size = size_attr,
                color = color_attr
            )

            if not product_sku.stock >= data.get("quantity"):
                raise serializers.ValidationError("Quantity specified is more than the quantity available in stock")


        except (Product.DoesNotExist, ProductAttribute.DoesNotExist, ProductSKU.DoesNotExist):
            raise serializers.ValidationError("Invalid product details. This product variant does not exist.")

        data['product_sku'] = product_sku

        return data
    
class deleteItemSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    size = serializers.CharField()
    color = serializers.CharField()

    def validate(self, data):
        try:
            product = Product.objects.get(id = data.get("product_id"))
            size_attr = ProductAttribute.objects.get(name = data.get("size"))
            color_attr = ProductAttribute.objects.get(name = data.get("color"))
            
            product_sku = ProductSKU.objects.get(
                product = product,
                size = size_attr,
                color = color_attr
            )

            cart_item = CartItem.objects.get(product_sku = product_sku)

        except(Product.DoesNotExist, ProductAttribute.DoesNotExist, ProductSKU.DoesNotExist, CartItem.DoesNotExist):
            raise serializers.ValidationError("Invalid product details. This product variant does not exist.")
        
        return cart_item