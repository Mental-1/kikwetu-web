'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  onEmailClick?: () => void;
  onPhoneClick?: () => void;
  onWhatsAppClick?: () => void;
  onMessageClick?: () => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  sellerName,
  email,
  phone,
  whatsapp,
  onEmailClick,
  onPhoneClick,
  onWhatsAppClick,
  onMessageClick
}: ContactModalProps) {
  const router = useRouter();

  const handleMessageClick = () => {
    onMessageClick?.();
    onClose();
    // Navigate to conversations page - the user can then select or start a conversation
    router.push('/conversations');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {sellerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-5 mt-6">
          {email && (
            <Button
              variant="outline"
              className="w-full justify-start py-4 px-4 h-auto"
              onClick={(e) => {
                e.preventDefault();
                onEmailClick?.();
                window.location.href = `mailto:${email}`;
              }}
            >
              <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-500">{email}</div>
              </div>
            </Button>
          )}

          {phone && (
            <Button
              variant="outline"
              className="w-full justify-start py-4 px-4 h-auto"
              onClick={(e) => {
                e.preventDefault();
                onPhoneClick?.();
                window.location.href = `tel:${phone}`;
              }}
            >
              <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">Phone</div>
                <div className="text-sm text-gray-500">{phone}</div>
              </div>
            </Button>
          )}

          {whatsapp && (
            <Button
              variant="outline"
              className="w-full justify-start py-4 px-4 h-auto"
              onClick={(e) => {
                e.preventDefault();
                onWhatsAppClick?.();
                window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank');
              }}
            >
              <MessageCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium">WhatsApp</div>
                <div className="text-sm text-gray-500">{whatsapp}</div>
              </div>
            </Button>
          )}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start py-4 px-4 h-auto"
            onClick={handleMessageClick}
          >
            <MessageCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">Send Message</div>
              <div className="text-sm opacity-90">Use our messaging system</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
