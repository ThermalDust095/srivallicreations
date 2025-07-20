import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types/Product';
import { useProducts } from '../../context/ProductContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size[0]);
  const [selectedColor, setSelectedColor] = useState(product.color[0]);
  const { addToCart } = useProducts();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedSize, selectedColor, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  const getStockForSize = (size: string) => {
    return product.sizeStock[size] || 0;
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked 
                ? 'bg-pink-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-500'
            }`}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleQuickView}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 sm:px-3 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}

        {/* Quick Add to Cart */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Size Selection */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center space-x-1">
            {product.size.slice(0, 4).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded border transition-colors duration-200 ${
                  selectedSize === size
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : getStockForSize(size) > 0 
                      ? 'border-gray-200 text-gray-600 hover:border-gray-300'
                      : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
                disabled={getStockForSize(size) === 0}
                title={`${size} - ${getStockForSize(size)} in stock`}
              >
                {size}
              </button>
            ))}
            {product.size.length > 4 && (
              <span className="text-xs text-gray-400 ml-1">+{product.size.length - 4}</span>
            )}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center space-x-2">
            {product.color.slice(0, 3).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                }`}
                style={{ 
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                 color.toLowerCase() === 'black' ? '#000000' :
                                 color.toLowerCase() === 'rose gold' ? '#E91E63' :
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                 color.toLowerCase() === 'burgundy' ? '#7c2d12' :
                                 color.toLowerCase() === 'emerald' ? '#047857' :
                                 color.toLowerCase() === 'classic blue' ? '#3b82f6' :
                                 color.toLowerCase() === 'light wash' ? '#93c5fd' :
                                 '#9ca3af'
                }}
                title={color}
              />
            ))}
            {product.color.length > 3 && (
              <span className="text-xs text-gray-400 ml-1">+{product.color.length - 3}</span>
            )}
          </div>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">${product.price}</span>
            {product.inStock ? (
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-xs text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;