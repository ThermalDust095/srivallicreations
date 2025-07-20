export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  size: string[];
  color: string[];
  images: string[];
  youtubeUrl?: string;
  inStock: boolean;
  featured: boolean;
  sizeStock: { [size: string]: number };
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}