export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    PRODUCT_DETAIL: (productId: string): string => `/product/${productId}`,
    GET_PRODUCTS: "/get-products",
    GET_ALL_PRODUCTS: "/get-all-products",
} as const;