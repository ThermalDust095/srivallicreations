import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Settings, Heart, Search } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { getCartItemsCount } = useProducts();
  const cartCount = getCartItemsCount();

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sri Valli Creations</span>
          </Link>

          {/* Navigation */}
          {!isAdmin && (
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                Categories
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-pink-600 transition-colors duration-200 font-medium"
              >
                About
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <>
                <button className="text-gray-700 hover:text-pink-600 transition-colors duration-200">
                  <Search className="w-5 h-5" />
                </button>
                <Link 
                  to="/cart" 
                  className="relative text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            <Link 
              to={isAdmin ? "/" : "/admin"} 
              className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {isAdmin ? 'Store' : 'Admin'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;