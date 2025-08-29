import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/Cart'; // <-- 2. Use the new Cart typesimport { useProducts } from '../../store/ProductContext';
import showToast from '../ui/Toast';
import Button from '../ui/Button';

import { useCart } from '../../store/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product_sku.product_id, item.product_sku.color, item.product_sku.size);
      return;
    }

    updateQuantity(item.id, item.product_sku.product_id, item.product_sku.color, item.product_sku.size, newQuantity);
  };

  return (
    <div className="p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <img
          src={item.product_sku.primary_image || '/placeholder-image.jpg'}
          alt={item.product_sku.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product_sku.name}</h3>
          {/* <p className="text-sm text-gray-500 mt-1">{item.category}</p> */}
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-600">Size: {item.product_sku.size || 'N/A'}</span>
            <span className="text-sm text-gray-600">Color: {item.product_sku.color || 'N/A'}</span>
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
          <p className="text-lg font-semibold text-gray-900">₹{(item.product_sku.price * item.quantity).toFixed(2)}</p>
          <p className="text-sm text-gray-500">₹{item.product_sku.price ? Number(item.product_sku.price).toFixed(2) : '0.00'} each</p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeFromCart(item.product_sku.product_id, item.product_sku.color, item.product_sku.size)}
          className="text-red-400 hover:text-red-600 p-2"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;