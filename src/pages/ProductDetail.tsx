import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, Play } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types/Product';
import { fetchProductDetail } from '../api/apiClient';
import { CardLoading, OverlayLoading, PageLoading } from '../components/Layout/Loading';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useProducts();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<Product | null>(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  React.useEffect(() => {
    const init = async () => {
    if (isLoading) {
      try{
        if (!id) return;
        const data:Product = await fetchProductDetail(id);
        setProduct(data);
        setLoading(false);
      }
      
      catch(err){
        console.error("Failed to fetch product", err);
        setProduct(null);
        setLoading(false);
      }

      finally{
        setLoading(false);
      }

    }}
    init();
  }, [id]);

  React.useEffect(() => {
    if (product) {
      if (product.size.length > 0) setSelectedSize(product.size[0]);
      if (product.color.length > 0) setSelectedColor(product.color[0]);
    }
  }, [product]);


    if (isLoading) {
      return <PageLoading/>
    }

    else{
      if (!product) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </div>
          </div>
        );
      }
    }


  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    const stockAvailable = product.sizeStock[selectedSize] || 0;
    if (stockAvailable < quantity) {
      alert(`Only ${stockAvailable} items available in size ${selectedSize}`);
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    alert('Added to cart successfully!');
  };

  const getStockForSize = (size: string) => {
    return product.sizeStock[size] || 0;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-pink-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* YouTube Video */}
              {product.youtubeUrl && getYouTubeEmbedUrl(product.youtubeUrl) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-red-500" />
                    Product Video
                  </h3>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <iframe
                      src={getYouTubeEmbedUrl(product.youtubeUrl)}
                      title="Product Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                    {product.category}
                  </span>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                {product.featured && (
                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-5 gap-2">
                  {product.size.map((size) => {
                    const stock = getStockForSize(size);
                    const isAvailable = stock > 0;
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-pink-500 bg-pink-50 text-pink-600'
                            : isAvailable
                            ? 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                        }`}
                        title={`${size} - ${stock} in stock`}
                      >
                        <div className="text-center">
                          <div>{size}</div>
                          <div className="text-xs mt-1">
                            {isAvailable ? `${stock} left` : 'Out of stock'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex items-center space-x-3">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                        selectedColor === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
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
                </div>
                <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => {
                        const maxStock = getStockForSize(selectedSize);
                        setQuantity(Math.min(maxStock, quantity + 1));
                      }}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStockForSize(selectedSize)} available
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || getStockForSize(selectedSize) === 0}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <Link
                  to="/products"
                  className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-pink-300 hover:text-pink-600 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Quality Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mt-2">${relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;