export interface User {
  role: 'admin' | 'customer';
  phone: string;
  phone_verified: boolean;
}

export interface LoginCredentials {
  phone: string;
  otp?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOTP: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  sentOTP: boolean;
  setSentOTP: (value: boolean) => void;
  verifyOTP: (credentials: LoginCredentials) => Promise<void>;
  OTPExpiry: number | null;
  setOTPExpiry: React.Dispatch<React.SetStateAction<number | null>>;
  accessToken: string | null;
}