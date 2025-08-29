import { ENDPOINTS } from '../constants/endpoints';
import { Cart } from '../types/Cart';
import { apiRequest } from './api';


export interface AddItemData {
  product_id: string;
  size: string;
  color: string;
  quantity: number;
}

export interface UpdateItemData{
    cart_item_id: string;
    quantity: number;
}

export interface RemoveItemData {
  product_id: string;
  size: string;
  color: string;
}

// GET  Fetches the user's cart
export const fetchCart = async (): Promise<Cart> => {
  const response = await apiRequest(ENDPOINTS.CART);
  return await response.json();
  
};

// POST - Adds an item to the cart
export const addItemToCart = async (itemData: AddItemData): Promise<Cart> => {
  const response = await apiRequest(ENDPOINTS.CART, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });

  return await response.json()
};

// PATCH Updates an item's quantity
export const updateItemQuantity = async (itemData: UpdateItemData): Promise<Cart> => {
  const response = await apiRequest(ENDPOINTS.CART, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  });

  return await response.json()
};

// DELETE - Removes an item from the cart
export const removeItemFromCart = async (itemData: RemoveItemData): Promise<Cart> => {
  const response = await apiRequest(ENDPOINTS.CART, {
    method: 'DELETE',
    body: JSON.stringify(itemData),
  });

  return await response.json()
};
