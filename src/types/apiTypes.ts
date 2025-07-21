import { Product } from './Product'

export interface getProductsResponse {
    count: number;
    page: number;
    totalCount: number;
    results: Product[];
}