import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '../types/Auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@srivalli.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'customer@example.com',
    name: 'Jane Customer',
    role: 'customer',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    createdAt: new Date().toISOString(),
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === credentials.email);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('User not found');
    }
    
    if (credentials.password !== 'password123') {
      setIsLoading(false);
      throw new Error('Invalid password');
    }
    
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      throw new Error('Passwords do not match');
    }
    
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAdmin,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};