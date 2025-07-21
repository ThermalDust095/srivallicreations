import { API_BASE_URL, ENDPOINTS } from "../constants/endpoints";
import { Product } from "../types/Product";

export async function fetchProductDetail(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCT_DETAIL(productId)}`);
    if (!response.ok){
        throw new Error("API Call Failed!!");
    }
    return response.json();
}