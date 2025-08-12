export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const ENDPOINTS = {
    // Auth endpoints (if you have them)
    SEND_OTP: "/api/users/send-otp/",
    VERIFY_OTP: "/api/users/verify-otp/",
    USER_PROFILE: "/api/users/me/",
    
    // Product endpoints
    GET_PRODUCTS: "/api/products/product/",
    GET_ALL_PRODUCTS: "/api/products/product/?all-data=true",
    PRODUCT_DETAIL: (productId: string): string => `/api/products/product/${productId}/`,
    CREATE_PRODUCT: "/api/products/product-create/",
    UPDATE_PRODUCT: (productId: string): string => `/api/products/product/${productId}/`,
    DELETE_PRODUCT: (productId: string): string => `/api/products/product/${productId}/`,
} as const;