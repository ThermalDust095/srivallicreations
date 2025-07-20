import React, { useState } from 'react';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/Product/ProductGrid';
import { Product } from '../types/Product';

const Home: React.FC = () => {
  const { products } = useProducts();
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Perfect Style
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                Explore our curated collection of elegant women's fashion. From casual wear to formal attire, 
                find pieces that express your unique personality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-pink-300 hover:text-pink-600 transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl transform rotate-6 opacity-20" />
              <img
                src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg"
                alt="Fashion Model"
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Truck className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $100. Fast and reliable delivery worldwide.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium quality materials and craftsmanship in every piece we create.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <RefreshCw className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free returns and exchanges. Your satisfaction is our priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces from our latest collection, crafted with attention to detail and designed to make you feel confident and beautiful.
            </p>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            onQuickView={setSelectedQuickViewProduct}
          />
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors duration-200"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                comment: "Absolutely love the quality and style! The delivery was fast and the customer service is excellent.",
                image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
              },
              {
                name: "Emily Davis",
                rating: 5,
                comment: "The best online fashion store I've ever shopped from. Every piece I've bought has exceeded my expectations.",
                image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
              },
              {
                name: "Jessica Wilson",
                rating: 5,
                comment: "Beautiful designs and perfect fit every time. The website is easy to navigate and checkout is seamless.",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;