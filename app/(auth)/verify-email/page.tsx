'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email] = useState('user@example.com'); // This would come from props or context
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1000);
  };

  return (
    <main className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-8 text-center">
          {/* Email Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Your Email Address
          </h1>

          {/* Description */}
          <div className="text-gray-600 mb-6">
            <p>
              We&apos;ve sent a verification email to{' '}
              <strong className="text-gray-900">{email}</strong>. 
              Please click the link inside to activate your account and keep it secure.
            </p>
          </div>

          {/* Resend Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>

          {/* Success Message */}
          {resendSuccess && (
            <div className="text-sm text-green-600 mb-4">
              Verification email sent successfully!
            </div>
          )}

          {/* Secondary Text */}
          <p className="text-sm text-gray-500 mb-6">
            Didn&apos;t receive the email? Check your spam folder.
          </p>

          {/* Action Links */}
          <div className="space-y-3">
            <Link 
              href="/change-email"
              className="block text-blue-600 hover:underline text-sm"
            >
              Change Email Address
            </Link>
            <Link 
              href="/"
              className="block text-blue-600 hover:underline text-sm"
            >
              Back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
