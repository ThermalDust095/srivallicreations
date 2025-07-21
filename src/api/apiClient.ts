import { API_BASE_URL, ENDPOINTS } from "../constants/endpoints";
import { Product } from "../types/Product";
import { getProductsResponse } from "../types/apiTypes";

export async function fetchProductDetail(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCT_DETAIL(productId)}`);
    if (!response.ok){
        throw new Error("API Call Failed!!");
    }
    return response.json();
}

export async function fetchProducts(page: number): Promise<{ results: Product[]; totalCount: number; count: number }> {
    // const params = new URLSearchParams({ page: String(page) });
    // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_PRODUCTS}?${params.toString()}`);
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_PRODUCTS}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data: getProductsResponse = await response.json();
    return {
        results: data.results,
        totalCount: data.totalCount,
        count: data.count,
    };
}

export async function fetchAllProducts(): Promise<{ results: Product[], totalCount: number; }> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_PRODUCTS}`);
    if (!response.ok) {
        throw new Error("Failed to fetch all products");
    }
    const data: getProductsResponse = await response.json();
    return {
        results: data.results,
        totalCount: data.totalCount,
        // count: data.count,
    };
}
