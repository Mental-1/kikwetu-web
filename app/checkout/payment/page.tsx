'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/navigation/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Plus, ArrowRight, HelpCircle, CreditCard as CreditCardIcon, ShieldCheck, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showToast } from '@/utils/toast';
import PaymentProcessingModal from '@/components/checkout/PaymentProcessingModal';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mpesa' | 'paystack';
  brand: string;
  last4: string;
  expiryMonth?: string;
  expiryYear?: string;
  phone?: string;
}

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('visa-4242');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'card' | 'mpesa'>('card');
  const [saveCard, setSaveCard] = useState(false);
  
  // Form state for new card
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });

  // Form state for new M-Pesa
  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    cardholderName?: string;
    phoneNumber?: string;
  }>({});

  // Payment processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string>('');

  // Get plan details from query params
  const planId = searchParams.get('plan');
  const billing = searchParams.get('billing') || 'monthly';
  const price = parseFloat(searchParams.get('price') || '0');

  // Plan details mapping
  const planDetails: Record<string, { name: string }> = {
    basic: { name: 'Basic Plan' },
    premium: { name: 'Premium Plan' },
    enterprise: { name: 'Enterprise Plan' },
  };

  const planName = planId ? planDetails[planId]?.name || 'Subscription' : 'Subscription';
  const subtotal = price;
  const shipping = 0; // No shipping for subscription
  const total = subtotal + shipping;

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'visa-4242',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '25',
    },
    {
      id: 'mpesa-0723',
      type: 'mpesa',
      brand: 'Safaricom M-Pesa',
      last4: '07******23',
      phone: '0723123456',
    },
    {
      id: 'paystack',
      type: 'paystack',
      brand: 'Paystack',
      last4: '',
    },
  ];

  // Luhn algorithm for card validation
  const validateCardNumber = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\s/g, '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    // Start from the rightmost digit
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  // Validate expiry date (must be in the future)
  const validateExpiryDate = (expiryDate: string): boolean => {
    const digits = expiryDate.replace(/\D/g, '');
    if (digits.length !== 4) return false;
    
    const month = parseInt(digits.slice(0, 2), 10);
    const year = parseInt('20' + digits.slice(2), 10);
    
    if (month < 1 || month > 12) return false;
    
    const expiry = new Date(year, month - 1);
    const now = new Date();
    
    return expiry > now;
  };

  // Validate Kenyan phone number
  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) return false;
    
    // Kenyan numbers start with 07 or 01
    return digits.startsWith('07') || digits.startsWith('01');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardData({ ...cardData, cardNumber: formatted });
    
    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Format as MM/YY
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardData({ ...cardData, expiryDate: value });
    
    // Clear error when user starts typing
    if (errors.expiryDate) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.expiryDate;
        return newErrors;
      });
    }
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4); // Support 3-4 digit CVC
    setCardData({ ...cardData, cvc: value });
    
    // Clear error when user starts typing
    if (errors.cvc) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cvc;
        return newErrors;
      });
    }
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    let value = e.target.value.replace(/[^a-zA-Z\s\-']/g, '');
    // Limit length
    if (value.length > 50) value = value.slice(0, 50);
    setCardData({ ...cardData, cardholderName: value });
    
    // Clear error when user starts typing
    if (errors.cardholderName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cardholderName;
        return newErrors;
      });
    }
  };

  const handleMpesaPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    // Format as XXX XXX XXXX
    let formatted = value;
    if (value.length > 6) {
      formatted = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else if (value.length > 3) {
      formatted = `${value.slice(0, 3)} ${value.slice(3)}`;
    }
    
    setMpesaData({ phoneNumber: formatted });
    
    // Clear error when user starts typing
    if (errors.phoneNumber) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };

  // Validate card form
  const validateCardForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Card number validation
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const cardDigits = cardData.cardNumber.replace(/\s/g, '');
      if (cardDigits.length < 13 || cardDigits.length > 19) {
        newErrors.cardNumber = 'Card number must be between 13 and 19 digits';
      } else if (!validateCardNumber(cardData.cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }
    }
    
    // Expiry date validation
    if (!cardData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      if (!validateExpiryDate(cardData.expiryDate)) {
        newErrors.expiryDate = 'Invalid or expired date. Format: MM/YY';
      }
    }
    
    // CVC validation
    if (!cardData.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else {
      if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
        newErrors.cvc = 'CVC must be 3 or 4 digits';
      }
    }
    
    // Cardholder name validation
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else {
      const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
      if (!nameRegex.test(cardData.cardholderName.trim())) {
        newErrors.cardholderName = 'Enter a valid name (letters, spaces, hyphens, and apostrophes only)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate M-Pesa form
  const validateMpesaForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!mpesaData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      if (!validatePhoneNumber(mpesaData.phoneNumber)) {
        newErrors.phoneNumber = 'Enter a valid Kenyan phone number (10 digits, starting with 07 or 01)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentType === 'card') {
      if (!validateCardForm()) {
        showToast.error('Validation Failed', 'Please fix the errors in the form');
        return;
      }
      
      // TODO: Save card to backend
      showToast.success('Card Added', 'Your card has been saved successfully');
      
      // Reset form
      setCardData({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
      });
      setSaveCard(false);
      setShowAddPayment(false);
      
    } else if (newPaymentType === 'mpesa') {
      if (!validateMpesaForm()) {
        showToast.error('Validation Failed', 'Please fix the errors in the form');
        return;
      }
      
      // TODO: Save M-Pesa to backend
      showToast.success('M-Pesa Added', 'Your M-Pesa number has been saved successfully');
      
      // Reset form
      setMpesaData({ phoneNumber: '' });
      setShowAddPayment(false);
    }
  };

  const processPayment = async () => {
    // Show processing modal
    setIsProcessingPayment(true);
    setPaymentStatus('processing');
    setPaymentErrorMessage('');

    try {
      // TODO: Replace with actual payment API call
      // Simulate payment processing (success 90% of the time for demo)
      const isSuccess = Math.random() > 0.1;

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      if (isSuccess) {
        setPaymentStatus('success');
        showToast.success('Payment Successful!', 'Your subscription is now active');
        
        // Navigate to confirmation page after a brief delay
        setTimeout(() => {
          setIsProcessingPayment(false);
          router.push(`/order-confirmation?plan=${planId}&billing=${billing}`);
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setPaymentErrorMessage('Your payment could not be processed. Please check your payment details and try again.');
        showToast.error('Payment Failed', 'We were unable to process your payment. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setPaymentErrorMessage('An unexpected error occurred. Please try again later.');
      showToast.error('Payment Failed', 'An error occurred while processing your payment.');
    }
  };

  const handlePayment = () => {
    if (!planId || total === 0) {
      showToast.error('Invalid Plan', 'Please select a plan first');
      router.push('/plans-billing');
      return;
    }

    // If using a saved payment method, proceed
    // If adding a new one, validate first
    if (showAddPayment) {
      if (newPaymentType === 'card') {
        if (!validateCardForm()) {
          showToast.error('Validation Failed', 'Please fix the errors in the form');
          return;
        }
      } else if (newPaymentType === 'mpesa') {
        if (!validateMpesaForm()) {
          showToast.error('Validation Failed', 'Please fix the errors in the form');
          return;
        }
      }
    }

    processPayment();
  };

  const handleRetryPayment = () => {
    processPayment();
  };

  const handleClosePaymentModal = () => {
    setIsProcessingPayment(false);
    setPaymentStatus('processing');
    setPaymentErrorMessage('');
  };

  // Redirect if no plan selected
  useEffect(() => {
    if (!planId || total === 0) {
      showToast.warning('No Plan Selected', 'Please select a plan first');
      router.push('/plans-billing');
    }
  }, [planId, total, router]);

  if (!planId || total === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/checkout/shipping" className="hover:text-gray-900 transition-colors">
              Shipping
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Payment</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">Confirmation</span>
          </div>
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        'flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all',
                        selectedPaymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        {method.type === 'card' ? (
                          <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs font-semibold flex items-center justify-center">
                            VISA
                          </div>
                        ) : method.type === 'mpesa' ? (
                          <div className="w-12 h-8 bg-green-600 rounded text-white text-xs font-semibold flex items-center justify-center">
                            M-PESA
                          </div>
                        ) : (
                          <div className="w-12 h-8 bg-purple-600 rounded text-white text-xs font-semibold flex items-center justify-center">
                            PAYSTACK
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 font-medium">
                            {method.brand}
                            {method.type === 'card' && ` ending in ${method.last4}`}
                            {method.type === 'mpesa' && ` ${method.last4}`}
                          </p>
                          {method.type === 'card' && method.expiryMonth && method.expiryYear && (
                            <p className="text-sm text-gray-600">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          )}
                          {method.type === 'paystack' && (
                            <p className="text-sm text-gray-600">
                              Credit/Debit card or bank transfer
                            </p>
                          )}
                        </div>
                      </div>
                      <RadioGroupItem value={method.id} id={method.id} />
                    </div>
                  ))}
                </RadioGroup>

                {/* Add New Payment Method Button */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-between"
                  onClick={() => setShowAddPayment(!showAddPayment)}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Payment Method</span>
                  </div>
                  <ArrowRight className={cn(
                    'w-4 h-4 transition-transform',
                    showAddPayment && 'rotate-90'
                  )} />
                </Button>
              </CardContent>
            </Card>

            {/* Add New Payment Method Section */}
            {showAddPayment && (
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Add a New Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Type Toggle */}
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setNewPaymentType('card')}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                        newPaymentType === 'card'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <CreditCardIcon className="w-4 h-4 inline-block mr-2" />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPaymentType('mpesa')}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                        newPaymentType === 'mpesa'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Smartphone className="w-4 h-4 inline-block mr-2" />
                      M-Pesa
                    </button>
                  </div>

                  {/* Add a New Card Form */}
                  {newPaymentType === 'card' && (
                    <>
                      {/* Card Number */}
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-900 font-medium">
                          Card Number
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className={cn(
                              'bg-white border-gray-300 text-gray-900 pr-10',
                              errors.cardNumber && 'border-red-500'
                            )}
                          />
                          <CreditCardIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                        )}
                      </div>

                      {/* Expiry Date and CVC */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate" className="text-gray-900 font-medium">
                            Expiry Date
                          </Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            placeholder="MM/YY"
                            value={cardData.expiryDate}
                            onChange={handleExpiryDateChange}
                            maxLength={5}
                            className={cn(
                              'bg-white border-gray-300 text-gray-900 mt-1',
                              errors.expiryDate && 'border-red-500'
                            )}
                          />
                          {errors.expiryDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Label htmlFor="cvc" className="text-gray-900 font-medium">
                              CVC
                            </Label>
                            <HelpCircle className="w-4 h-4 text-gray-400" />
                          </div>
                          <Input
                            id="cvc"
                            type="text"
                            placeholder="123"
                            value={cardData.cvc}
                            onChange={handleCVCChange}
                            maxLength={4}
                            className={cn(
                              'bg-white border-gray-300 text-gray-900 mt-1',
                              errors.cvc && 'border-red-500'
                            )}
                          />
                          {errors.cvc && (
                            <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>
                          )}
                        </div>
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <Label htmlFor="cardholderName" className="text-gray-900 font-medium">
                          Cardholder Name
                        </Label>
                        <Input
                          id="cardholderName"
                          type="text"
                          placeholder="John Doe"
                          value={cardData.cardholderName}
                          onChange={handleCardholderNameChange}
                          className={cn(
                            'bg-white border-gray-300 text-gray-900 mt-1',
                            errors.cardholderName && 'border-red-500'
                          )}
                        />
                        {errors.cardholderName && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardholderName}</p>
                        )}
                      </div>

                      {/* Save Card Checkbox */}
                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id="saveCard"
                          checked={saveCard}
                          onCheckedChange={(checked) => setSaveCard(!!checked)}
                        />
                        <Label htmlFor="saveCard" className="text-gray-700 text-sm cursor-pointer">
                          Save card for future use
                        </Label>
                      </div>
                    </>
                  )}

                  {/* Add M-Pesa Number Form */}
                  {newPaymentType === 'mpesa' && (
                    <div>
                      <Label htmlFor="mpesaPhone" className="text-gray-900 font-medium">
                        M-Pesa Phone Number
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="mpesaPhone"
                          type="tel"
                          placeholder="0712 345 678"
                          value={mpesaData.phoneNumber}
                          onChange={handleMpesaPhoneChange}
                          maxLength={12}
                          className={cn(
                            'bg-white border-gray-300 text-gray-900 pr-10',
                            errors.phoneNumber && 'border-red-500'
                          )}
                        />
                        <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                      {errors.phoneNumber ? (
                        <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
                      ) : (
                        <p className="text-xs text-gray-500 mt-1">
                          Enter your Safaricom M-Pesa registered phone number
                        </p>
                      )}
                    </div>
                  )}

                  {/* Add Payment Method Button */}
                  <Button
                    type="button"
                    onClick={handleAddPaymentMethod}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                  >
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="bg-white border-gray-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan Item */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-gray-900 font-medium">{planName}</p>
                    <p className="text-sm text-gray-600">
                      {billing === 'monthly' ? 'Monthly subscription' : 'Annual subscription'}
                    </p>
                  </div>
                  <p className="text-gray-900 font-medium">KES {subtotal.toLocaleString()}</p>
                </div>

                {/* Shipping (if applicable) */}
                {shipping > 0 && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <p className="text-gray-900">Shipping</p>
                    <p className="text-gray-900">KES {shipping.toLocaleString()}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    KES {total.toLocaleString()}
                  </p>
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold mt-6"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Pay KES {total.toLocaleString()}
                </Button>

                {/* Security Assurances */}
                <div className="pt-4 space-y-2">
                  <p className="text-xs text-gray-600 text-center">
                    Your payment information is encrypted and secure.
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Secured by SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Processing Modal */}
      <PaymentProcessingModal
        isOpen={isProcessingPayment}
        status={paymentStatus}
        message={
          paymentStatus === 'processing'
            ? 'Please wait while we securely process your payment...'
            : undefined
        }
        errorMessage={paymentErrorMessage}
        onRetry={handleRetryPayment}
        onClose={handleClosePaymentModal}
      />
    </div>
  );
}
