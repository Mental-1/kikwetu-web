'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulate API call
    console.log('Sending reset email to:', email);
    setIsSubmitted(true);
    setError('');
  };

  if (isSubmitted) {
    return (
      <main className="flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email
            </CardTitle>
            <p className="text-gray-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Email
              </Button>
              <Link 
                href="/signin"
                className="block text-sm text-blue-600 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12">
      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Forgot Your Password?
          </h1>
          <p className="text-gray-600">
            No worries! Enter your email address below and we&apos;ll send you a link to reset it.
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <Link 
            href="/signin"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <Link href="/help" className="hover:text-gray-900">Help</Link>
          <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}