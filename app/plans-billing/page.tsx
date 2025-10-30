'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Download, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isCurrent?: boolean;
}

export default function PlansBillingPage() {
  const router = useRouter();
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        '5 active listings',
        'Basic ad placement',
        'Email support',
      ],
    },
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 499,
      annualPrice: 4789, // Save 20%: 499 * 12 * 0.8 = 4,790.4 ≈ 4,789
      features: [
        '20 active listings',
        'Basic ad placement',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 999,
      annualPrice: 9589, // Save 20%: 999 * 12 * 0.8 = 9,590.4 ≈ 9,589
      isCurrent: true,
      features: [
        '50 active listings',
        'Featured ad placement',
        'Priority email support',
        'Basic analytics',
        'Advanced search filters',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 2499,
      annualPrice: 23989, // Save 20%: 2499 * 12 * 0.8 = 23,990.4 ≈ 23,989
      features: [
        'Unlimited listings',
        'Top ad placement',
        'Dedicated phone support',
        'Advanced analytics',
        'Custom integrations',
        'Priority customer service',
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') return; // Free plan cannot be selected
    
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // If it's the current plan, don't do anything
    if (plan.isCurrent) return;

    setSelectedPlanId(planId);
    
    // Navigate to checkout with plan details
    const price = billingFrequency === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    const queryParams = new URLSearchParams({
      plan: planId,
      billing: billingFrequency,
      price: price.toString(),
    });
    
    router.push(`/checkout/payment?${queryParams.toString()}`);
  };

  const currentPlan = plans.find(p => p.isCurrent);
  const nextRenewalDate = new Date();
  nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  nextRenewalDate.setDate(25);

  const getCurrentPlanPrice = () => {
    if (!currentPlan) return 0;
    return billingFrequency === 'monthly' 
      ? currentPlan.monthlyPrice 
      : currentPlan.annualPrice;
  };

  const paymentMethods = [
    {
      id: '1',
      type: 'visa',
      last4: '1234',
      expiryMonth: '08',
      expiryYear: '26',
      brand: 'Visa',
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5678',
      expiryMonth: '11',
      expiryYear: '25',
      brand: 'Mastercard',
    },
  ];

  const billingHistory = [
    { date: 'July 25, 2024', amount: 999.00, invoice: 'INV-001' },
    { date: 'June 25, 2024', amount: 999.00, invoice: 'INV-002' },
    { date: 'May 25, 2024', amount: 999.00, invoice: 'INV-003' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plans & Billing</h1>
          <p className="text-gray-600">
            Manage your subscription, view billing history, and update payment methods.
          </p>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Plans */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Frequency Toggle */}
              <div className="flex items-center justify-center gap-4 bg-white border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => setBillingFrequency('monthly')}
                  className={cn(
                    'px-4 py-2 rounded-md font-medium transition-colors',
                    billingFrequency === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingFrequency('annually')}
                  className={cn(
                    'px-4 py-2 rounded-md font-medium transition-colors relative',
                    billingFrequency === 'annually'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  Annually
                  <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                    Save 20%
                  </span>
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const displayPrice = billingFrequency === 'monthly' 
                    ? plan.monthlyPrice 
                    : plan.annualPrice;
                  const isSelected = selectedPlanId === plan.id;
                  
                  return (
                    <Card
                      key={plan.id}
                      className={cn(
                        'bg-white border-gray-200 relative cursor-pointer transition-all hover:border-blue-400 hover:shadow-md',
                        plan.isCurrent && 'border-blue-600 border-2',
                        isSelected && !plan.isCurrent && 'border-blue-500 border-2',
                        plan.id === 'free' && 'opacity-75'
                      )}
                      onClick={() => !plan.isCurrent && plan.id !== 'free' && handlePlanSelect(plan.id)}
                    >
                      {plan.isCurrent && (
                        <Badge className="absolute top-3 right-3 bg-blue-600 text-white">
                          Current Plan
                        </Badge>
                      )}
                      {isSelected && !plan.isCurrent && (
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                          Selected
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="text-gray-900 text-xl">{plan.name}</CardTitle>
                        <div className="mt-2">
                          {displayPrice === 0 ? (
                            <span className="text-2xl font-bold text-gray-900">Free</span>
                          ) : (
                            <>
                              <span className="text-2xl font-bold text-gray-900">
                                KES {displayPrice.toLocaleString()}
                              </span>
                              <span className="text-gray-600 text-sm ml-1">
                                /{billingFrequency === 'monthly' ? 'month' : 'year'}
                              </span>
                            </>
                          )}
                        </div>
                        {billingFrequency === 'annually' && displayPrice > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            KES {Math.round(plan.monthlyPrice)}/month billed annually
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={cn(
                            'w-full',
                            plan.isCurrent
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : plan.id === 'free'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          )}
                          disabled={plan.isCurrent || plan.id === 'free'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanSelect(plan.id);
                          }}
                        >
                          {plan.isCurrent
                            ? 'Your Plan'
                            : plan.id === 'free'
                            ? 'Downgrade'
                            : isSelected
                            ? 'Selected'
                            : 'Select Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Current Plan, Payment Methods, Billing History */}
            <div className="space-y-6">
              {/* Current Plan Card */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Your Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentPlan?.name} Plan
                    </p>
                    <p className="text-gray-600">
                      {getCurrentPlanPrice() === 0 
                        ? 'Free'
                        : `KES ${getCurrentPlanPrice().toLocaleString()}/${billingFrequency === 'monthly' ? 'mo' : 'yr'}`
                      }
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Your plan renews on{' '}
                      <span className="text-gray-900 font-medium">
                        {nextRenewalDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-900">Payment Methods</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs font-semibold flex items-center justify-center">
                          {method.type === 'visa' ? 'VISA' : 'MC'}
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-medium">
                            {method.brand} ending in {method.last4}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-gray-600 text-sm font-medium pb-3">Date</th>
                          <th className="text-left text-gray-600 text-sm font-medium pb-3">Amount</th>
                          <th className="text-left text-gray-600 text-sm font-medium pb-3">Inv</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 last:border-0">
                            <td className="py-3 text-gray-900 text-sm">{item.date}</td>
                            <td className="py-3 text-gray-900 text-sm">
                              KES {item.amount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3">
                              <button className="text-blue-600 hover:text-blue-700">
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
    </div>
  );
}
