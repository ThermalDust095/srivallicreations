export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
    LOGIN: "/auth/login",
    PRODUCT_DETAIL: (productId: string): string => `/product/${productId}`,
    ITEM: "/item"
} as const;