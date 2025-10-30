import { apiClient, API_ENDPOINTS, ApiResponse } from './client';

// Message Types
export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: Array<{
    id: string;
    url: string;
    type: 'image' | 'file';
    name: string;
    size: number;
  }>;
  read: boolean;
  createdAt: string;
}

export interface SendMessageData {
  conversationId?: string;
  recipientId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  attachments?: Array<{
    url: string;
    type: 'image' | 'file';
    name: string;
    size: number;
  }>;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  totalCount: number;
}

// Messages API functions
export const messagesApi = {
  // Get all conversations
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient.get<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  },

  // Get conversation by ID
  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    return apiClient.get<Conversation>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/${id}`);
  },

  // Get messages in a conversation
  getMessages: async (
    conversationId: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<MessagesResponse>> => {
    const params = new URLSearchParams();
    params.append('conversationId', conversationId);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    return apiClient.get<MessagesResponse>(
      `${API_ENDPOINTS.MESSAGES.MESSAGES}?${params.toString()}`
    );
  },

  // Send a message
  sendMessage: async (data: SendMessageData): Promise<ApiResponse<Message>> => {
    return apiClient.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data);
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`${API_ENDPOINTS.MESSAGES.MESSAGES}/${messageId}/read`, {});
  },

  // Mark conversation as read
  markConversationAsRead: async (conversationId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(
      `${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/${conversationId}/read`,
      {}
    );
  },
};
