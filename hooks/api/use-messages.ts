/**
 * Messages Hooks
 * React Query hooks for messaging operations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, type ApiResponse } from '@/api';
import { queryKeys } from './query-keys';

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
  content: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  createdAt: string;
}

export interface SendMessageData {
  conversationId?: string;
  recipientId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}

/**
 * Hook for fetching all conversations
 */
export function useConversations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () =>
      apiClient.get<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS),
    select: (response: ApiResponse<Conversation[]>) =>
      response.success ? response.data : null,
    enabled,
  });
}

/**
 * Hook for fetching messages in a conversation with infinite scroll
 */
export function useConversationMessages(conversationId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.messages.conversation(conversationId),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.get<{
        messages: Message[];
        hasMore: boolean;
      }>(
        `${API_ENDPOINTS.MESSAGES.MESSAGES}?conversationId=${conversationId}&page=${pageParam}`
      );
      return {
        data: response.success ? response.data.messages : [],
        nextPage: response.success && response.data.hasMore
          ? (pageParam as number) + 1
          : undefined,
        hasMore: response.success ? response.data.hasMore : false,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: enabled && !!conversationId,
  });
}

/**
 * Hook for sending a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) =>
      apiClient.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        // Invalidate conversations to update last message
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversations(),
        });
        // If conversationId is provided, invalidate that conversation's messages
        if (variables.conversationId) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.messages.conversation(variables.conversationId),
          });
        }
      }
    },
  });
}
