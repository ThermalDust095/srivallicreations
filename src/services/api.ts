import { API_BASE_URL, ENDPOINTS } from "../constants/endpoints";
import { Product } from "../types/Product";
import { GetProductsResponse, CreateProductRequest, UpdateProductRequest, ApiError, VerifyOTPResponse } from "../types/apiTypes";
import { LoginCredentials, User } from "../types/Auth";

// const refreshToken = sessionStorage.getItem('refreshToken')

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

const apiRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('accessToken');
    const validToken = token && token !== 'undefined' && token !== 'null' && token.trim() !== '';

    console.log('Sending request to:', url);
    console.log('Token:', token);
    console.log('Adding Authorization header?', validToken);

    const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(validToken ? {'Authorization': `Bearer ${token}`} : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return response;
};

const apiFormDataRequest = async (url: string, formData: FormData, method: string = 'POST'): Promise<Response> => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: method,
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
    
    const processedResults = data.results.map(product => ({
        ...product,
        color: product.colors || [],
    }));
    
    return {
        results: processedResults,
        totalCount: data.count,
        count: data.results.length,
    };
}

export async function fetchAllProducts(): Promise<Product[]> {
    const response = await apiRequest(ENDPOINTS.GET_ALL_PRODUCTS);
    const data: Product[] = await response.json();
    
    return data
    
}

export async function createProduct(productData: CreateProductRequest): Promise<Product> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', String(productData.price));
    formData.append('category', productData.category);
    formData.append('inStock', String(productData.inStock));
    formData.append('featured', String(productData.featured));
    
    if (productData.youtubeUrl) {
        formData.append('youtubeUrl', productData.youtubeUrl);
    }
    
    if (productData.skus && productData.skus.length > 0) {
        formData.append('skus', JSON.stringify(productData.skus));
    }
    
    if (productData.image_files && productData.image_files.length > 0) {
        productData.image_files.forEach((image) => {
            formData.append('image_files', image);
        });
    }
    
    const response = await apiFormDataRequest(ENDPOINTS.CREATE_PRODUCT, formData);
    return await response.json();
}

export async function updateProduct(productId: string, productData: Partial<UpdateProductRequest>): Promise<Product> {
    if (productData.image_files && productData.image_files.length > 0) {
    const formData = new FormData();

    Object.keys(productData).forEach(key => {
        if (key === 'image_files') return; // we'll handle files separately
        if (key === 'skus') {
            formData.append(key, JSON.stringify(productData[key]));
        } else {
            formData.append(key, String(productData[key]));
        }
    });

    productData.image_files.forEach((file: File) => {
        formData.append('image_files', file); // key must match backend expectation
    });

    const response = await apiFormDataRequest(
        ENDPOINTS.UPDATE_PRODUCT(productId),
        formData,
        'PUT'
    );
    return await response.json();
}

}

export async function deleteProduct(productId: string): Promise<void> {
    await apiRequest(ENDPOINTS.DELETE_PRODUCT(productId), {
        method: 'DELETE',
    });
}

export async function patchProduct(productId: string, productData: Partial<UpdateProductRequest>): Promise<Product> {
    const response = await apiRequest(ENDPOINTS.UPDATE_PRODUCT(productId), {
        method: 'PATCH',
        body: JSON.stringify(productData),
    });
    return await response.json();
}

export async function loginWithOTP(phone: string): Promise<Response>{
    const response = await apiRequest(ENDPOINTS.SEND_OTP, {
        method: 'POST',
        body: JSON.stringify({ phone: phone }),
    });

    return await response;
}

export async function verifyLoginOTP(credentials: LoginCredentials): Promise<VerifyOTPResponse>{
    const response = await apiRequest(ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });

    return await response.json()
}

export async function fetchUserProfile(): Promise<User>{
    const response = await apiRequest(ENDPOINTS.USER_PROFILE, {
        method: 'GET',
    })

    return await response.json()
}