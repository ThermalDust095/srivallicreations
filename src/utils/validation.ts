import { Product } from '../types/Product';

export const validateProductSelection = (
  product: Product,
  selectedSize: string,
  selectedColor: string,
  quantity: number = 1
): { isValid: boolean; error?: string } => {
  if (!selectedSize || !selectedColor) {
    return { isValid: false, error: 'Please select size and color' };
  }

  const stockAvailable = product.sizeStock?.[selectedSize] || 0;
  if (stockAvailable < quantity) {
    return { 
      isValid: false, 
      error: `Only ${stockAvailable} items available in size ${selectedSize}` 
    };
  }

  return { isValid: true };
};

export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};

export const getColorStyle = (color: string): React.CSSProperties => {
  const colorMap: Record<string, string> = {
    'white': '#ffffff',
    'black': '#000000',
    'rose gold': '#E91E63',
    'navy': '#1e3a8a',
    'burgundy': '#7c2d12',
    'emerald': '#047857',
    'classic blue': '#3b82f6',
    'light wash': '#93c5fd',
  };

  return {
    backgroundColor: colorMap[color.toLowerCase()] || '#9ca3af'
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};