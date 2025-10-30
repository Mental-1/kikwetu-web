'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function PasswordUpdatedPage() {
  return (
    <main className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Password Updated!
          </h1>

          {/* Description */}
          <div className="text-gray-600 mb-8 space-y-2">
            <p>Your password has been successfully changed.</p>
            <p>You can now use your new password to sign in to your account.</p>
          </div>

          {/* Sign In Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            asChild
          >
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
