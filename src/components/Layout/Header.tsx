import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Settings, Heart, Search, User, LogOut } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../Auth/LoginForm';

const Header: React.FC = () => {
  const location = useLocation();
  const { getCartItemsCount } = useProducts();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const cartCount = getCartItemsCount();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

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
                {isAuthenticated() && (
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
                )}
              </>
            )}
            
            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-200"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}
    </header>
  );
};

export default Header;