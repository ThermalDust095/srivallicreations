export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const ENDPOINTS = {
    // Auth endpoints (if you have them)
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    
    // Product endpoints
    GET_PRODUCTS: "/product/",
    GET_ALL_PRODUCTS: "/product/",
    PRODUCT_DETAIL: (productId: string): string => `/product/${productId}/`,
    CREATE_PRODUCT: "/product-create/",
    UPDATE_PRODUCT: (productId: string): string => `/product/${productId}/`,
    DELETE_PRODUCT: (productId: string): string => `/product/${productId}/`,
} as const;