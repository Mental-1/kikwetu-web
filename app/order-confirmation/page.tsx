'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Download, Mail, Home, Package, Calendar } from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get order details from query params
  const planId = searchParams.get('plan');
  const billing = searchParams.get('billing') || 'monthly';

  // Plan details mapping
  const planDetails: Record<string, { name: string; features: string[] }> = {
    basic: { 
      name: 'Basic Plan',
      features: ['Up to 10 active listings', 'Basic analytics', 'Email support']
    },
    premium: { 
      name: 'Premium Plan',
      features: ['Unlimited listings', 'Advanced analytics', 'Priority support', 'Featured listings']
    },
    enterprise: { 
      name: 'Enterprise Plan',
      features: ['Unlimited everything', 'Custom analytics', 'Dedicated support', 'API access']
    },
  };

  const plan = planId ? planDetails[planId] : null;

  // Simulate order details
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Redirect if no plan
  useEffect(() => {
    if (!planId || !plan) {
      router.push('/plans-billing');
    }
  }, [planId, plan, router]);

  if (!planId || !plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your subscription has been activated successfully
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {billing === 'monthly' ? 'Monthly subscription' : 'Annual subscription'}
                      </p>
                    </div>
                    <p className="text-gray-900 font-medium">Active</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Number</p>
                      <p className="font-medium text-gray-900">{orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-medium text-gray-900">{orderDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm">
                      {billing === 'monthly' 
                        ? 'Your subscription will renew monthly'
                        : 'Your subscription will renew annually'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>You can now post unlimited listings (based on your plan)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>A confirmation email has been sent to your registered email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Manage your subscription from your dashboard at any time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Cards */}
          <div className="space-y-6">
            {/* Download Invoice */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Confirmation Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Get Started */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start using your subscription right away
                </p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/post-ad/details">
                    Post Your First Ad
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            asChild
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Link href="/seller-dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-gray-900"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
