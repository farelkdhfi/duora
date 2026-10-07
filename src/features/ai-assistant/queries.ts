// ai-assistant/queries.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrCreateActiveConversation,
  getConversationMessages,
  sendMessage,
  getMessagesSentToday,
  startNewConversation,
  deleteConversation,
  getMyConversations,
} from "./api";

export const aiAssistantKeys = {
  all: ["ai-assistant"] as const,
  activeConversation: (relationshipId: string) =>
    [...aiAssistantKeys.all, "active-conversation", relationshipId] as const,
  messages: (conversationId: string) =>
    [...aiAssistantKeys.all, "messages", conversationId] as const,
  messagesToday: () => [...aiAssistantKeys.all, "messages-today"] as const,
};

export function useActiveConversation(relationshipId: string | undefined) {
  return useQuery({
    queryKey: aiAssistantKeys.activeConversation(relationshipId ?? ""),
    queryFn: () => getOrCreateActiveConversation(relationshipId as string),
    enabled: !!relationshipId,
  });
}

export function useConversationMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: aiAssistantKeys.messages(conversationId ?? ""),
    queryFn: () => getConversationMessages(conversationId as string),
    enabled: !!conversationId,
  });
}

export function useMessagesSentToday() {
  return useQuery({
    queryKey: aiAssistantKeys.messagesToday(),
    queryFn: getMessagesSentToday,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: aiAssistantKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: aiAssistantKeys.messagesToday() });
    },
  });
}

export function useStartNewConversation(relationshipId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startNewConversation(relationshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: aiAssistantKeys.activeConversation(relationshipId),
      });
    },
  });
}

export function useMyConversations(relationshipId: string | undefined) {
  return useQuery({
    queryKey: [...aiAssistantKeys.all, "conversations", relationshipId ?? ""],
    queryFn: () => getMyConversations(relationshipId as string),
    enabled: !!relationshipId,
  });
}

export function useDeleteConversation(relationshipId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...aiAssistantKeys.all, "conversations", relationshipId],
      });
    },
  });
}