export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  colors: string[]; // Backend returns 'colors' array
  images: string[];
  primary_image?: string;
  youtubeUrl?: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  deleted_at?: string | null;
  skus: ProductSKU[];
  image_files?: File[]; // For image uploads
}

export interface CreateProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  featured: boolean;
  youtubeUrl?: string;
  skus: { size: string; color: string; stock: number }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ProductSKU {
  size: string;
  color: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  image: string;
  is_primary: boolean;
}