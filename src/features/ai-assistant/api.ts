// ai-assistant/api.ts

import { createClient } from "@/lib/supabase/client";
import type {
  AiAssistantConversation,
  AiAssistantMessage,
  SendMessageResponse,
} from "./types";

const supabase = createClient();

export async function getOrCreateActiveConversation(
  relationshipId: string
): Promise<AiAssistantConversation> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Cari conversation terbaru milik user ini
  const { data: existing, error: fetchError } = await supabase
    .from("ai_assistant_conversations")
    .select("*")
    .eq("user_id", user.id)
    .eq("relationship_id", relationshipId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) return existing;

  // Belum ada, buat baru
  const { data: created, error: createError } = await supabase
    .from("ai_assistant_conversations")
    .insert({
      user_id: user.id,
      relationship_id: relationshipId,
    })
    .select()
    .single();

  if (createError) throw createError;

  return created;
}

export async function getConversationMessages(
  conversationId: string
): Promise<AiAssistantMessage[]> {
  const { data, error } = await supabase
    .from("ai_assistant_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as AiAssistantMessage[];
}

export async function sendMessage({
  conversationId,
  message,
  provider,
}: {
  conversationId: string;
  message: string;
  provider?: "openrouter" | "groq";
}): Promise<SendMessageResponse> {
  const { data, error } = await supabase.functions.invoke("ai-assistant-chat", {
    body: {
      conversationId,
      userMessage: message,
      provider,
    },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);

  return data as SendMessageResponse;
}

export async function getMessagesSentToday(): Promise<number> {
  const { data, error } = await supabase.rpc(
    "get_ai_assistant_messages_sent_today"
  );

  if (error) throw error;
  return data as number;
}

export async function startNewConversation(
  relationshipId: string
): Promise<AiAssistantConversation> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .insert({
      user_id: user.id,
      relationship_id: relationshipId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyConversations(
  relationshipId: string
): Promise<AiAssistantConversation[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("ai_assistant_conversations")
    .select("*")
    .eq("user_id", user.id)
    .eq("relationship_id", relationshipId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as AiAssistantConversation[];
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from("ai_assistant_conversations")
    .delete()
    .eq("id", conversationId);

  if (error) throw error;
}

export async function getLastMessagePreview(
  conversationId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("ai_assistant_messages")
    .select("content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.content ?? null;
}