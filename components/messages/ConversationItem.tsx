'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer transition-colors hover:bg-gray-50 relative border-l-4',
        isActive ? 'bg-blue-50 hover:bg-blue-50 border-blue-600' : 'border-transparent'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {conversation.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={cn(
                'font-semibold text-gray-900 truncate',
                conversation.unreadCount > 0 && 'font-bold'
              )}
            >
              {conversation.userName}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {conversation.timestamp}
              </span>
              {conversation.unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate mb-1">
            {conversation.lastMessage}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {conversation.itemTitle}
          </p>
        </div>
      </div>
    </div>
  );
}

