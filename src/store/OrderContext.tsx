import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CreateOrderRequest } from '../types/Order';
import showToast from '../components/ui/Toast';

interface OrderContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getUserOrders: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      // Simulate API call - replace with actual API integration
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        userId: 'current_user_id', // Replace with actual user ID
        items: orderData.items.map(item => ({
          productId: item.productId,
          productName: `Product ${item.productId}`, // This should come from product data
          productImage: '/placeholder-image.jpg', // This should come from product data
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: 0, // This should come from product data
          subtotal: 0, // Calculate based on price * quantity
        })),
        deliveryAddress: orderData.deliveryAddress,
        totalAmount: 0, // Calculate from items
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: orderData.notes,
      };

      setOrders(prev => [newOrder, ...prev]);
      showToast.success('Order created successfully!');
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      showToast.error('Failed to create order. Please try again.');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // Simulate API call - replace with actual API integration
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ));
      showToast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast.error('Failed to update order status. Please try again.');
      throw error;
    }
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      setOrders,
      createOrder,
      updateOrderStatus,
      getUserOrders,
      getOrderById,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};