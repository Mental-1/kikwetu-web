'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/navigation/Header';
import { Input } from '@/components/ui/input';
import { MessageCircle, Search } from 'lucide-react';
import MessageView from '@/components/messages/MessageView';
import ConversationItem from '@/components/messages/ConversationItem';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'seller';
  senderName?: string;
  senderAvatar?: string;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  itemTitle: string;
  itemImage?: string;
  itemPrice: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

export default function ConversationsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get('id') || null
  );
  
  // Initialize conversations data
  const initialConversations: Conversation[] = [
    {
      id: '1',
      userId: 'jane-smith',
      userName: 'Jane Smith',
      userAvatar: '/placeholder-avatar.jpg',
      lastMessage: 'Perfect, I can meet you tomorrow...',
      itemTitle: 'Vintage Leather Jacket',
      itemImage: '/placeholder-laptop-1.jpg',
      itemPrice: '$120.00',
      timestamp: '2 min ago',
      unreadCount: 0,
      messages: [
        {
          id: 'm1',
          text: 'Hello! Yes, the vintage leather jacket is still available. It\'s in excellent condition.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          sender: 'seller',
          senderName: 'Jane Smith',
          senderAvatar: '/placeholder-avatar.jpg',
        },
        {
          id: 'm2',
          text: 'Great to hear! I\'m very interested. Could you tell me more about the sizing?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          sender: 'user',
        },
        {
          id: 'm3',
          text: 'Of course. It\'s a men\'s medium. The chest is about 40 inches and the sleeve length is 25 inches. Would you like me to take any other measurements?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          sender: 'seller',
          senderName: 'Jane Smith',
          senderAvatar: '/placeholder-avatar.jpg',
        },
        {
          id: 'm4',
          text: 'That sounds like it would fit perfectly. I\'d like to buy it. When and where can we meet?',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
          sender: 'user',
        },
        {
          id: 'm5',
          text: 'Perfect, I can meet you tomorrow afternoon at the downtown coffee shop. Say 2 PM?',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
          sender: 'seller',
          senderName: 'Jane Smith',
          senderAvatar: '/placeholder-avatar.jpg',
        },
      ],
    },
    {
      id: '2',
      userId: 'robert-brown',
      userName: 'Robert Brown',
      userAvatar: '/placeholder-avatar.jpg',
      lastMessage: 'Is the price negotiable?',
      itemTitle: 'Antique Wooden Chair',
      itemImage: '/placeholder-laptop-2.jpg',
      itemPrice: '$85.00',
      timestamp: '1 hour ago',
      unreadCount: 0,
      messages: [
        {
          id: 'm6',
          text: 'Is the price negotiable?',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          sender: 'seller',
          senderName: 'Robert Brown',
        },
      ],
    },
    {
      id: '3',
      userId: 'emily-white',
      userName: 'Emily White',
      userAvatar: '/placeholder-avatar.jpg',
      lastMessage: 'Thanks for the quick response!',
      itemTitle: 'Set of Classic Novels',
      itemImage: '/placeholder-laptop-3.jpg',
      itemPrice: '$45.00',
      timestamp: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm7',
          text: 'Thanks for the quick response!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          sender: 'seller',
          senderName: 'Emily White',
        },
      ],
    },
    {
      id: '4',
      userId: 'michael-chen',
      userName: 'Michael Chen',
      userAvatar: '/placeholder-avatar.jpg',
      lastMessage: 'Can you send me more photos?',
      itemTitle: 'Designer Lamp',
      itemImage: '/placeholder-laptop-1.jpg',
      itemPrice: '$75.00',
      timestamp: '12/10/24',
      unreadCount: 0,
      messages: [
        {
          id: 'm8',
          text: 'Can you send me more photos?',
          timestamp: new Date('2024-10-12').toISOString(),
          sender: 'user',
        },
      ],
    },
  ];

  // Use state for conversations so updates trigger re-renders
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      conv.userName.toLowerCase().includes(query) ||
      conv.itemTitle.toLowerCase().includes(query)
    );
  });

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Mark as read when selected
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId && conv.unreadCount > 0
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedConversationId) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      text: messageText,
      timestamp: new Date().toISOString(),
      sender: 'user',
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              timestamp: 'Just now',
            }
          : conv
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={true} />

      <main className="w-full px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-8rem)] w-full">
          {/* Left Column - Conversations List */}
          <div className="lg:col-span-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden max-h-[600px] lg:max-h-none">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Messages</h1>
              <p className="text-sm text-gray-600">All your active conversations.</p>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or item"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-300 focus:bg-white"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isActive={selectedConversationId === conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-600">No conversations found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchQuery ? 'Try a different search term' : 'Start a conversation with a seller'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Message View or Empty State */}
          <div className="hidden lg:block lg:col-span-2">
            {selectedConversation ? (
              <MessageView
                conversationId={selectedConversation.id}
                sellerName={selectedConversation.userName}
                sellerAvatar={selectedConversation.userAvatar}
                productImage={selectedConversation.itemImage}
                productTitle={selectedConversation.itemTitle}
                productPrice={selectedConversation.itemPrice}
                isOnline={true}
                messages={selectedConversation.messages}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Your Conversations</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Select a conversation from the list on the left to view messages and continue chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

