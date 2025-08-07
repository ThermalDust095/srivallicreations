import { Product } from './Product'

export interface GetProductsResponse {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Product[];
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    featured: boolean;
    youtubeUrl?: string;
    skus: Array<{
        size: string;
        color: string;
        stock: number;
    }>;
    images?: File[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: string;
}

export interface ApiError {
    detail?: string;
    message?: string;
    [key: string]: any;
}