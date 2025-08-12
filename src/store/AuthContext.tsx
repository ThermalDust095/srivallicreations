import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, AuthContextType } from '../types/Auth';
import showToast from '../components/ui/Toast';
import { loginWithOTP, verifyLoginOTP, fetchUserProfile } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sentOTP, setSentOTP] = useState(false);
  const [OTPExpiry, setOTPExpiry] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

   if (storedAccessToken && storedAccessToken !== 'undefined' && storedAccessToken !== "null") {
    setAccessToken(storedAccessToken);
  }
    if (storedRefreshToken && storedRefreshToken !== 'undefined' && storedAccessToken !== "null") {
      setRefreshToken(storedRefreshToken);
  }
  }, [])

  useEffect(() => {
    if (accessToken && accessToken != "undefined" && accessToken != "null"){
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken && refreshToken != "undefined" && refreshToken != "null"){
      localStorage.setItem('refreshToken', refreshToken)
    }
  
  }, [accessToken, refreshToken])

  useEffect(() => {
    const init = async() => {
      if (!accessToken) return;
      try{
       const userData = await fetchUserProfile();
       userData.phone_verified ? setUser(userData) : setUser(null)
      }
      catch(err: any){
        showToast.error(err.message)
      }
    }

    init();

  }, [accessToken])

    const startOTPExpiry = () => {
    setOTPExpiry(Date.now() + 120000); // 2 min from now
  };

  useEffect(() => {
    if (!OTPExpiry) return;

    const interval = setInterval(() => {
      const totalSeconds = Math.max(
        0,
        Math.ceil((OTPExpiry - Date.now()) / 1000)
      );

      if (totalSeconds <= 0) {
        setSentOTP(false);
        setOTPExpiry(null);
        clearInterval(interval);
      } else {
        // This just forces a re-render without changing OTPExpiry
        setOTPExpiry((prev) => prev);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [OTPExpiry, setOTPExpiry, setSentOTP]);

  const sendOTP = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try{
      let res = await loginWithOTP(credentials.phone);
      if(res.ok){
        setSentOTP(true)
        startOTPExpiry();
      }
    }catch(err: any){
      showToast.error(`Error Occured: ${err.message}`)
    }finally{
      setIsLoading(false);
    }
  };


  const verifyOTP = async (credentials: LoginCredentials): Promise<void> =>{
    setIsLoading(true);
    try{
      let res = await verifyLoginOTP(credentials);
      setAccessToken(res.access_token)
      setRefreshToken(res.refresh_token)
      
    }catch(err: any){
      showToast.error(`Error Occured: ${err.message}`)
    }finally{
      setIsLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const isAdmin = () => user?.role === 'admin';
  const isAuthenticated = () => user !== null;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      sendOTP,
      logout,
      isAdmin,
      isAuthenticated,
      sentOTP,
      setSentOTP,
      verifyOTP,
      OTPExpiry,
      setOTPExpiry,
      accessToken

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