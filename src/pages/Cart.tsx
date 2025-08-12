import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../store/ProductContext';
import { useAuth } from '../store/AuthContext';
import DeliveryAddressForm from '../components/Forms/DeliveryAddressForm';
import { DeliveryAddressFormData } from '../schemas/authSchemas';
import showToast from '../components/ui/Toast';
import CartItem from '../components/cart/CartItem';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Cart: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useProducts();
  const { user } = useAuth();
  const [showDeliveryForm, setShowDeliveryForm] = React.useState(false);
  const total = getTotalPrice();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast.error('Your cart is empty');
      return;
    }
    setShowDeliveryForm(true);
  };

  const handleDeliverySubmit = async (data: DeliveryAddressFormData) => {
    // Here you would typically save the address and process the order
    console.log('Delivery address:', data);
    showToast.success('Order placed successfully! We will deliver to your address soon.');
    clearCart();
    setShowDeliveryForm(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">Welcome back</p>
          </div>
          <Link
            to="/products"
            className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        <Card padding="none" className="overflow-hidden">
          {/* Cart Items */}
          <div>
            {cart.map((item, index) => (
              <CartItem 
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                item={item}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
              >
                Clear Cart
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Delivery Address Form */}
      {showDeliveryForm && (
        <DeliveryAddressForm
          onClose={() => setShowDeliveryForm(false)}
          onSubmit={handleDeliverySubmit}
        />
      )}
    </div>
  );
};

export default Cart;