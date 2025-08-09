import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!isAuthenticated()) {
    if (!showLogin) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {requireAdmin ? 'Admin Access Required' : 'Login Required'}
            </h2>
            <p className="text-gray-600 mb-8">
              {requireAdmin 
                ? 'Please sign in with admin credentials to access this area.'
                : 'Please sign in to continue shopping.'
              }
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
          {showLogin && (
            <LoginForm 
              onClose={() => setShowLogin(false)} 
              defaultRole={requireAdmin ? 'admin' : 'customer'}
            />
          )}
        </div>
      );
    }

    return <LoginForm onClose={() => setShowLogin(false)} defaultRole={requireAdmin ? 'admin' : 'customer'} />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;