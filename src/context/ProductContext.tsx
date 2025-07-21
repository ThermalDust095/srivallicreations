import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types/Product';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateCartQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Sample initial products
const initialProducts: Product[] = [];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateCartQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === id && item.selectedSize === size && item.selectedColor === color
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      cart,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getTotalPrice,
      getCartItemsCount,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};