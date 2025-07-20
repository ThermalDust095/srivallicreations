import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem } from '../types/Product';

interface ProductContextType {
  products: Product[];
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
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Silk Blouse',
    description: 'A luxurious silk blouse perfect for office wear or evening occasions.',
    price: 89.99,
    category: 'Tops',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['White', 'Black', 'Rose Gold'],
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    inStock: true,
    featured: true,
    sizeStock: { 'XS': 5, 'S': 10, 'M': 15, 'L': 8, 'XL': 3 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Designer Midi Dress',
    description: 'Stunning midi dress with intricate patterns, perfect for special occasions.',
    price: 129.99,
    category: 'Dresses',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Navy', 'Burgundy', 'Emerald'],
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    inStock: true,
    featured: true,
    sizeStock: { 'XS': 3, 'S': 7, 'M': 12, 'L': 5 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'High-Waisted Denim',
    description: 'Premium quality high-waisted jeans with a flattering fit.',
    price: 79.99,
    category: 'Bottoms',
    size: ['24', '26', '28', '30', '32'],
    color: ['Classic Blue', 'Black', 'Light Wash'],
    images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'],
    youtubeUrl: '',
    inStock: true,
    featured: false,
    sizeStock: { '24': 4, '26': 8, '28': 12, '30': 6, '32': 2 },
    createdAt: new Date().toISOString(),
  },
];

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