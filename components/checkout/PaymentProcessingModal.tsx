'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, X, Loader2 } from 'lucide-react';

type PaymentStatus = 'processing' | 'success' | 'failed';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: PaymentStatus;
  message?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export default function PaymentProcessingModal({
  isOpen,
  status,
  message,
  errorMessage,
  onRetry,
  onClose,
}: PaymentProcessingModalProps) {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Only allow closing if status is 'failed'
        if (!open && status === 'failed') {
          onClose?.();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md"
        showCloseButton={status === 'failed'} // Only show close button on failure
      >
        <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
          {/* Processing State */}
          {status === 'processing' && (
            <>
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600">
                {message || 'Please wait while we process your payment...'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Do not close this window
              </p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                {message || 'Your payment has been processed successfully'}
              </p>
            </>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <X className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-6">
                {errorMessage || 'We were unable to process your payment. Please try again.'}
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={onRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Retry Payment
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

