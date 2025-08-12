import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types/Product';
import { createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '../services/api';
import { CreateProductRequest } from '../types/apiTypes';
import showToast from '../components/ui/Toast';

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addProduct: (product: CreateProductRequest) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product, size: string, color: string, quantity: number, availableStock: number) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateCartQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = async (productData: CreateProductRequest) => {
    try {
      const newProduct = await apiCreateProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      showToast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      showToast.error('Failed to create product. Please try again.');
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await apiUpdateProduct(id, productData);
      setProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
      showToast.success('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      showToast.error('Failed to update product. Please try again.');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiDeleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      setCart(prev => prev.filter(item => item.id !== id));
      showToast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast.error('Failed to delete product. Please try again.');
      throw error;
    }
  };

  const addToCart = (product: Product, size: string, color: string, quantity: number, availableStock: number) => {
    if (!product || !size || !color || quantity <= 0) {
      showToast.error('Invalid product selection');
      return;
    }

    if (availableStock < quantity) {
      showToast.error(`Only ${availableStock} items available in size ${size}`);
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > availableStock) {
          showToast.error(`Cannot add more items. Only ${availableStock} available.`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
    
    showToast.success(`Added ${quantity} item(s) to cart`);
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