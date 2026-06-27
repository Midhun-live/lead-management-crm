'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../services/api/axiosInstance';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').transform((val) => val.replace(/\s+/g, ' ')),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await axiosInstance.post('/auth/register', data);
        const loginResponse = await axiosInstance.post('/auth/login', {
          email: data.email,
          password: data.password,
        });
        const { token, user } = loginResponse.data.data;
        login(token, user);
        toast.success('Account created successfully and logged in!');
      } else {
        const response = await axiosInstance.post('/auth/login', data);
        const { token, user } = response.data.data;
        login(token, user);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Something went wrong';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isRegister ? 'Create your account' : 'Sign in to LeadCRM'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                reset();
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none cursor-pointer"
            >
              {isRegister ? 'sign in to existing account' : 'create a new account'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isRegister && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              error={errors.name?.message as string}
              {...registerField('name')}
            />
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message as string}
            {...registerField('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message as string}
            {...registerField('password')}
          />

          <div>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 font-semibold"
            >
              {isRegister ? 'Register' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
