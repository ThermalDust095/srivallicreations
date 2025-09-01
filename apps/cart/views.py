from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, AddItemSerializer, deleteItemSerializer
from products.models import ProductSKU, Product, ProductAttribute


class CartView(APIView):

    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user = request.user)
        cart_serializer = CartSerializer(cart, context={'request': request})
        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        cart, __ = Cart.objects.get_or_create(user = request.user)

        input_serializer = AddItemSerializer(data = request.data)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data
        product_sku = validated_data['product_sku']
        quantity = validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            cart = cart, 
            product_sku = product_sku,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        output_serializer = CartSerializer(cart, context={'request': request})
        return Response(output_serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, *args, **kwargs):
        cart_item_id = request.data.get('cart_item_id')
        quantity = int(request.data.get('quantity', 0))

        if not cart_item_id:
            return Response(
                {"error": "cart_item_id is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Get the user's cart to ensure they can only modify their own items.
        cart, _ = Cart.objects.get_or_create(user=request.user)

        try:
            # 3. FILTER to find the ONE item you want to change.
            # We use cart.items.get() to ensure the item belongs to this user's cart.
            cart_item = cart.items.get(id=cart_item_id)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found in your cart."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # 4. Now, update only that specific item's quantity.
        if quantity > 0:
            # You can add a stock check here if you want
            # if quantity > cart_item.product_sku.stock:
            #     return Response(...)
            
            cart_item.quantity = quantity
            cart_item.save() # Save the specific instance
        else:
            # If quantity is 0, remove the item from the cart.
            cart_item.delete()

        # 5. Return the entire updated cart.
        cart_serializer = CartSerializer(cart, context={'request': request})
        return Response(cart_serializer.data, status=status.HTTP_200_OK)
        
    def delete(self, request, *args, **kwargs):
        cart , ___ = Cart.objects.get_or_create(user = request.user)
        input_serializer = deleteItemSerializer(data = request.data)
        input_serializer.is_valid(raise_exception=True)

        cart_item = input_serializer.validated_data
        cart_item.delete()
        cart_serializer = CartSerializer(cart, context={'request': request})
        
        return Response(cart_serializer.data, status= status.HTTP_200_OK)