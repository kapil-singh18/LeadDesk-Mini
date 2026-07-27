import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Layers, AlertCircle, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { loginSchema, LoginInput } from '../validators/authValidator.js';
import { authApiClient } from '../services/authApiClient.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card } from '../components/ui/Card.js';
import { Footer } from '../components/layout/Footer.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFillDemoCredentials = () => {
    setValue('email', 'admin@leaddesk.com', { shouldValidate: true });
    setValue('password', 'LeadDesk@Admin', { shouldValidate: true });
    setServerError(null);
  };

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await authApiClient.login(data);
      if (response.success) {
        navigate(from, { replace: true });
      } else {
        const errObj = typeof response.error === 'object' && response.error !== null ? response.error : null;
        const errorMsg =
          typeof response.error === 'string'
            ? response.error
            : errObj?.message || 'Authentication failed.';
        setServerError(errorMsg);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const axiosError = err as { response?: { data?: { error?: string | { message?: string } } } };
      const errRes = axiosError.response?.data?.error;
      const message =
        typeof errRes === 'string'
          ? errRes
          : errRes?.message || 'Invalid credentials or server unavailable.';
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#5F6FFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#5F6FFF] text-white mx-auto flex items-center justify-center shadow-md">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Admin Portal Login
        </h2>
        <p className="text-sm text-gray-500">
          Sign in with admin credentials to manage submitted leads.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-card border-gray-100 bg-white p-8">
          {/* Quick Demo Fill Alert (Development Only) */}
          {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-[#F2F3FF] border border-[#5F6FFF]/20 rounded-xl flex items-start justify-between gap-3 text-xs text-gray-700">
              <div className="space-y-1">
                <span className="font-bold text-[#5F6FFF] flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Seed Admin Credentials (DEV mode only):
                </span>
                <p className="text-gray-600">
                  Email: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200">admin@leaddesk.com</code>
                </p>
                <p className="text-gray-600">
                  Password: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200">LeadDesk@Admin</code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="shrink-0 text-xs font-semibold text-[#5F6FFF] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-md border border-[#5F6FFF]/30 shadow-2xs"
              >
                Autofill
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@leaddesk.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full text-sm font-semibold shadow-sm"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In to Dashboard
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};
