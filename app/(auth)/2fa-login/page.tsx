'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Home, Lock } from 'lucide-react';

export default function TwoFactorAuthPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful verification
      console.log('2FA verified:', otp);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Marketplace</span>
            </Link>
            
            {/* Security Icon */}
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Authenticator App
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code from your authenticator app to continue.
            </p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>

            {/* Helper Links */}
            <div className="text-center space-y-2">
              <Link
                href="/backup-code"
                className="text-sm text-gray-600 hover:text-blue-600 underline"
              >
                Didn&apos;t get a code? Use a backup code.
              </Link>
              <br />
              <Link
                href="/contact-support"
                className="text-sm text-gray-600 hover:text-blue-600 underline"
              >
                Lost your device? Contact support.
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}