import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onClose: () => void;
  defaultRole?: 'admin' | 'customer';
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, defaultRole = 'customer' }) => {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: defaultRole === 'admin' ? 'admin@srivalli.com' : '',
    password: defaultRole === 'admin' ? 'password123' : '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600">
          {defaultRole === 'admin' 
            ? 'Admin Portal Access' 
            : isLogin 
              ? 'Sign in to your account' 
              : 'Join Sri Valli Creations'
          }
        </p>
      </div>

      {defaultRole === 'admin' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Admin Credentials:</strong><br />
            Email: admin@srivalli.com<br />
            Password: password123
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            icon={<User className="w-4 h-4" />}
            placeholder="Enter your full name"
            required={!isLogin}
          />
        )}

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          placeholder="Enter your email"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {!isLogin && (
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            placeholder="Confirm your password"
            required={!isLogin}
          />
        )}

        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          className="mt-6"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      {defaultRole !== 'admin' && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default LoginForm;