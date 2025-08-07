export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  size: string[];
  color: string[];
  colors: string[]; // Backend returns 'colors' array
  images: string[];
  primary_image?: string;
  youtubeUrl?: string;
  inStock: boolean;
  featured: boolean;
  sizeStock: { [size: string]: number };
  createdAt: string;
  deleted_at?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ProductSKU {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  image: string;
  is_primary: boolean;
}