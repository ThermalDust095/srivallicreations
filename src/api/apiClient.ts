import { API_BASE_URL, ENDPOINTS } from "../constants/endpoints";
import { Product } from "../types/Product";
import { GetProductsResponse, CreateProductRequest, UpdateProductRequest, ApiError } from "../types/apiTypes";

// Helper function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
        // If we can't parse the error response, use the default message
    }
    
    throw new Error(errorMessage);
};

// Helper function to make API requests
const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return response;
};

// Helper function for FormData requests (file uploads)
const apiFormDataRequest = async (url: string, formData: FormData): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return response;
};

export async function fetchProductDetail(productId: string): Promise<Product> {
    const response = await apiRequest(ENDPOINTS.PRODUCT_DETAIL(productId));
    const product = await response.json();
    
    // Ensure color array exists (backend returns 'colors')
    if (product.colors && !product.color) {
        product.color = product.colors;
    }
    
    return product;
}

export async function fetchProducts(page: number = 1): Promise<{ results: Product[]; totalCount: number; count: number }> {
    const params = new URLSearchParams();
    if (page > 1) {
        params.append('page', String(page));
    }
    
    const url = `${ENDPOINTS.GET_PRODUCTS}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiRequest(url);
    const data: GetProductsResponse = await response.json();
    
    // Process products to ensure color array exists
    const processedResults = data.results.map(product => ({
        ...product,
        color: product.colors || product.color || [],
    }));
    
    return {
        results: processedResults,
        totalCount: data.count,
        count: data.results.length,
    };
}

export async function fetchAllProducts(): Promise<{ results: Product[], totalCount: number; }> {
    const response = await apiRequest(ENDPOINTS.GET_ALL_PRODUCTS);
    const data: GetProductsResponse = await response.json();
    
    // Process products to ensure color array exists
    const processedResults = data.results.map(product => ({
        ...product,
        color: product.colors || product.color || [],
    }));
    
    return {
        results: processedResults,
        totalCount: data.count,
    };
}

export async function createProduct(productData: CreateProductRequest): Promise<Product> {
    // If images are provided, use FormData for file upload
    if (productData.images && productData.images.length > 0) {
        const formData = new FormData();
        
        // Add basic product data
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', String(productData.price));
        formData.append('category', productData.category);
        formData.append('inStock', String(productData.inStock));
        formData.append('featured', String(productData.featured));
        
        if (productData.youtubeUrl) {
            formData.append('youtubeUrl', productData.youtubeUrl);
        }
        
        // Add SKUs as JSON
        if (productData.skus && productData.skus.length > 0) {
            formData.append('skus', JSON.stringify(productData.skus));
        }
        
        // Add images
        productData.images.forEach((image, index) => {
            formData.append('images', image);
        });
        
        const response = await apiFormDataRequest(ENDPOINTS.CREATE_PRODUCT, formData);
        return await response.json();
    } else {
        // No images, use regular JSON request
        const response = await apiRequest(ENDPOINTS.CREATE_PRODUCT, {
            method: 'POST',
            body: JSON.stringify(productData),
        });
        return await response.json();
    }
}

export async function updateProduct(productId: string, productData: Partial<UpdateProductRequest>): Promise<Product> {
    const response = await apiRequest(ENDPOINTS.UPDATE_PRODUCT(productId), {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
    return await response.json();
}

export async function deleteProduct(productId: string): Promise<void> {
    await apiRequest(ENDPOINTS.DELETE_PRODUCT(productId), {
        method: 'DELETE',
    });
}

// Partial update (PATCH)
export async function patchProduct(productId: string, productData: Partial<UpdateProductRequest>): Promise<Product> {
    const response = await apiRequest(ENDPOINTS.UPDATE_PRODUCT(productId), {
        method: 'PATCH',
        body: JSON.stringify(productData),
    });
    return await response.json();
}