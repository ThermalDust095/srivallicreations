export interface ProductSKU{
    size: string;
    color: string;
    stock: number;
    price: number;
    name: string;
    product_id: string;
    primary_image: string;
}

export interface CartItem{
    id: string;
    quantity: number;
    total_price: string;
    product_sku: ProductSKU;
}

export interface Cart {
  id: string;
  items: CartItem[];
  grand_total: number;
}