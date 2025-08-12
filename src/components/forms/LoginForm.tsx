import React, { useEffect, useState } from 'react';
import { User, PhoneCall, MessageCircle } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

import { loginSchema } from '../../schemas/authSchemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


interface LoginFormProps {
  onClose: () => void;
  defaultRole?: 'admin' | 'customer';
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, defaultRole = 'customer' }) => {
  const { sendOTP, isLoading, sentOTP, verifyOTP, OTPExpiry, setOTPExpiry, setSentOTP } = useAuth();

  const getRemainingTime = () => {
    if (!OTPExpiry) return "00:00";
    const totalSeconds = Math.max(0, Math.ceil((OTPExpiry - Date.now()) / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [tick, setTick] = useState(0); // dummy state

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
        setTick((t) => t + 1); // forces re-render
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [OTPExpiry, setOTPExpiry, setSentOTP]);


  type formData = z.infer<typeof loginSchema>;

  const {register, handleSubmit, formState: { errors },} = useForm<formData>({
    resolver: zodResolver(loginSchema),
      defaultValues: {
      phone: '',
      otp: '',
    },
  });

  const onSubmit = async (data: formData) => {
    try {
      if (sentOTP) {
        verifyOTP(data);
        onClose()
        console.log('Verifying OTP:', data.otp);
      } else {
        // Send OTP logic
        sendOTP(data);
        console.log('Sending OTP to:', data.phone);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome
        </h2>
        <p className="text-gray-600">
          Login to your account
        </p>
      </div>

      {
        Object.values(errors).map((error, index) => (
          <div key={index} className="text-red-500 text-sm mb-2">
            {error.message}
          </div>
        ))
      }

      {
        sentOTP && (
          <div className='container mx-auto px-4 text-center rounded-lg my-4'>
            <p className='text-pink-500 font-bold'>Please wait <a className='text-pink-600'>{getRemainingTime()}</a> before requesting a new OTP.</p>
          </div>
        )
      }


      {defaultRole === 'admin' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Demo Admin Credentials:</strong><br />
            Email: admin@srivalli.com<br />
            Password: password123
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className='relative'>
          <Input
           label = "Phone Number"
           type="text"
           icon={<PhoneCall className="w-4 h-4" />}
           {...register('phone', { required: true })}
           placeholder="eg, +911234567890" 
          required
          />

        </div>

        <div className="relative" hidden={!sentOTP}>
          <Input
            label="OTP"
            type="text"
            inputMode="numeric" // mobile numpad
            pattern="\d*"
            {...register('otp', {valueAsNumber: false})}
            icon={<MessageCircle className="w-4 h-4" />}
            placeholder="Enter your OTP"
            disabled = {!sentOTP}
            required = {sentOTP}
          />

        </div>
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          className="mt-6"
        >
          {sentOTP ? 'Verify OTP' : 'Send OTP'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default LoginForm;