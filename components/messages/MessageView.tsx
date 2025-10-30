'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'seller';
  senderName?: string;
  senderAvatar?: string;
}

interface MessageViewProps {
  conversationId: string;
  sellerName: string;
  sellerAvatar?: string;
  productImage?: string;
  productTitle: string;
  productPrice: string;
  isOnline?: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function MessageView({
  conversationId,
  sellerName,
  sellerAvatar,
  productImage,
  productTitle,
  productPrice,
  isOnline = false,
  messages,
  onSendMessage,
}: MessageViewProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (messageDate.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Product Info */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            {productImage ? (
              <Image
                src={productImage}
                alt={productTitle}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{productTitle}</h3>
            <p className="text-sm text-blue-600">{productPrice}</p>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">{sellerName}</p>
            <p className={cn(
              'text-xs',
              isOnline ? 'text-green-600' : 'text-gray-500'
            )}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={sellerAvatar} alt={sellerName} />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {sellerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            <div className="space-y-2">
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-2',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                {message.sender === 'seller' && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar || sellerAvatar} alt={message.senderName || sellerName} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                      {(message.senderName || sellerName).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    'max-w-[70%] rounded-lg px-4 py-2',
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  )}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={cn(
                      'text-xs',
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    )}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'user' && (
                      <svg className="w-3 h-3 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 flex-shrink-0" />
                )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-gray-600 hover:text-gray-900"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-50 border-gray-300 focus:bg-white"
          />
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

