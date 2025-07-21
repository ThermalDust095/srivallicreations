import React from 'react';
import { Loader2, Heart } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  overlay = false,
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-pink-600',
    secondary: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => (
    <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : size === 'xl' ? 'w-4 h-4' : 'w-2.5 h-2.5'} 
                     ${color === 'primary' ? 'bg-pink-600' : color === 'secondary' ? 'bg-purple-600' : color === 'white' ? 'bg-white' : 'bg-gray-600'} 
                     rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} ${color === 'primary' ? 'bg-pink-600' : color === 'secondary' ? 'bg-purple-600' : color === 'white' ? 'bg-white' : 'bg-gray-600'} rounded-full animate-pulse`} />
  );

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );

  const renderLoadingContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {variant !== 'skeleton' && renderLoadingContent()}
      {variant === 'skeleton' && renderLoadingContent()}
      {text && variant !== 'skeleton' && (
        <p className={`${textSizeClasses[size]} ${colorClasses[color]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        {content}
      </div>
    );
  }

  return content;
};

// Specialized loading components for common use cases
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => (
  <div className="flex items-center space-x-2">
    <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-white animate-spin`} />
    <span className="text-white">Loading...</span>
  </div>
);

export const PageLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Sri Valli Creations</h2>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

export const CardLoading: React.FC<{ 
  variant?: 'product' | 'cart' | 'admin-row' | 'testimonial' | 'basic';
  className?: string;
}> = ({ variant = 'basic', className = '' }) => {
  const renderProductCard = () => (
    <div className={`group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-pulse ${className}`}>
      {/* Image placeholder */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
        {/* Featured badge placeholder */}
        <div className="absolute top-4 left-4">
          <div className="bg-gray-300 rounded-full h-6 w-16"></div>
        </div>
        {/* Action buttons placeholder */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full"></div>
        </div>
        {/* Quick add button placeholder */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="w-full bg-gray-300 rounded-lg h-10"></div>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Product name and description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        {/* Size selection placeholder */}
        <div className="flex items-center space-x-1">
          <div className="h-6 w-8 bg-gray-200 rounded border"></div>
          <div className="h-6 w-8 bg-gray-200 rounded border"></div>
          <div className="h-6 w-8 bg-gray-200 rounded border"></div>
          <div className="h-6 w-8 bg-gray-200 rounded border"></div>
        </div>
        {/* Color selection placeholder */}
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
        </div>
        {/* Price and category */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const renderCartCard = () => (
    <div className={`p-6 animate-pulse ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
        {/* Product Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
        {/* Price */}
        <div className="text-right space-y-1">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        {/* Remove Button */}
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const renderAdminRow = () => (
    <tr className={`hover:bg-gray-50 animate-pulse ${className}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="ml-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  const renderTestimonial = () => (
    <div className={`bg-gray-50 rounded-2xl p-4 sm:p-6 text-center animate-pulse ${className}`}>
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
      <div className="flex justify-center mb-4 space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
    </div>
  );

  const renderBasicCard = () => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  switch (variant) {
    case 'product':
      return renderProductCard();
    case 'cart':
      return renderCartCard();
    case 'admin-row':
      return renderAdminRow();
    case 'testimonial':
      return renderTestimonial();
    default:
      return renderBasicCard();
  }
};

// Hero Section Loading
export const HeroLoading: React.FC = () => (
  <section className="relative h-[60vh] sm:h-[70vh] bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 overflow-hidden animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded w-2/3"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl w-40"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-36"></div>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="w-full h-96 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  </section>
);

// Product Grid Loading
export const ProductGridLoading: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CardLoading key={index} variant="product" />
    ))}
  </div>
);

// Admin Dashboard Stats Loading
export const StatsLoading: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center">
          <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
          <div className="ml-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Header Loading (for when user data is loading)
export const HeaderLoading: React.FC = () => (
  <div className="flex items-center space-x-2 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    <div className="hidden md:block h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

export const InlineLoading: React.FC<{ text?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  text = "Loading...", 
  size = 'sm' 
}) => (
  <div className="flex items-center justify-center space-x-2 py-4">
    <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-pink-600 animate-spin`} />
    <span className="text-gray-600">{text}</span>
  </div>
);

export const OverlayLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-pink-600 animate-spin mx-auto mb-2" />
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);

export default Loading;