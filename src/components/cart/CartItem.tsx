import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/Product';
import { useProducts } from '../../store/ProductContext';
import showToast from '../ui/Toast';
import Button from '../ui/Button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useProducts();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id, item.selectedSize, item.selectedColor);
      return;
    }

    const maxStock = item.skus.find(
      sku =>
        sku.size === item.selectedSize &&
        sku.color === item.selectedColor
    )?.stock || 0;

    if (newQuantity > maxStock) {
      showToast.error(`Only ${maxStock} items available`);
      return;
    }

    updateCartQuantity(item.id, item.selectedSize, item.selectedColor, newQuantity);
  };

  return (
    <div className="p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <img
          src={item.images?.[0] || '/placeholder-image.jpg'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-600">Size: {item.selectedSize || 'N/A'}</span>
            <span className="text-sm text-gray-600">Color: {item.selectedColor || 'N/A'}</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-auto h-auto p-0 rounded-full"
          >
            <Minus className="w-4 h-4 "/>
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-auto h-auto p-0 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
          <p className="text-sm text-gray-500">₹{item.price ? Number(item.price).toFixed(2) : '0.00'} each</p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
          className="text-red-400 hover:text-red-600 p-2"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;