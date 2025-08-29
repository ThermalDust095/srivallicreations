import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '../types/Cart';
import * as cartApi from '../services/cartApi';
import showToast from '../components/ui/Toast';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, color: string, size: string) => Promise<void>;
  updateQuantity: (cartItemId: string, productId: string, color: string, size: string, quantity: number) => Promise<void>;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch the cart from the backend when the app loads
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const fetchedCart = await cartApi.fetchCart();
        setCart(fetchedCart);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        // Don't show an error toast on initial load, it might just be an empty cart
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, size: string, color: string, quantity: number) => {
    try {
      const updatedCart = await cartApi.addItemToCart({ product_id: productId, size, color, quantity });
      setCart(updatedCart); // Update state with the response from the server
      showToast.success('Item added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast.error('Could not add item to cart.');
    }
  };

  const removeFromCart = async (productId: string, color: string, size: string) => {
    try {
      const updatedCart = await cartApi.removeItemFromCart({ product_id: productId, color: color, size: size });
      setCart(updatedCart);
      showToast.success('Item removed from cart.');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      showToast.error('Could not remove item from cart.');
    }
  };

  const updateQuantity = async (cartItemId: string, productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, color, size);
      return;
    }
    try {
      const updatedCart = await cartApi.updateItemQuantity({ cart_item_id: cartItemId, quantity: quantity });
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showToast.error('Could not update item quantity.');
    }
  };
  
  const getCartItemsCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, getCartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};