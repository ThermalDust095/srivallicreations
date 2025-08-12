import { z } from 'zod';

export const loginSchema = z.object({
  phone : z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  otp: z.string()
    .optional()
    .refine(
      val => !val || /^\d{6}$/.test(val),
      { message: 'OTP must be a 6-digit number' }
    )
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const deliveryAddressSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters long'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
  addressLine1: z
    .string()
    .min(1, 'Address line 1 is required')
    .min(5, 'Please enter a complete address'),
  addressLine2: z
    .string()
    .optional(),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'Please enter a valid city name'),
  state: z
    .string()
    .min(1, 'State is required'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit postal code'),
  country: z
    .string()
    .min(1, 'Country is required')
    .default('India'),
  isDefault: z
    .boolean()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DeliveryAddressFormData = z.infer<typeof deliveryAddressSchema>;