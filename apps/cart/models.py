from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings
import uuid

# Create your models here.

class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_sku = models.ForeignKey('products.ProductSKU', on_delete=models.CASCADE)
    cart = models.ForeignKey('Cart', related_name='items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        """Calculates the total price for this cart item."""
        # Ensure product_sku and product exist to avoid errors
        if self.product_sku and self.product_sku.product:
            return self.product_sku.product.price * self.quantity
        return 0
    
    class Meta:
        # Added constraint to prevent duplicate items
        unique_together = ('cart', 'product_sku')

    def __str__(self):
        return f"{self.quantity} of {self.product_sku.product.name} (SKU: {self.product_sku.id})"
    
class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.id} with {self.items.count()} items"