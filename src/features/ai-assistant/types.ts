// ai-assistant/types.ts

export type AiAssistantMessageRole = "user" | "assistant";

export interface AiAssistantConversation {
  id: string;
  user_id: string;
  relationship_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiAssistantMessage {
  id: string;
  conversation_id: string;
  role: AiAssistantMessageRole;
  content: string;
  tools_used: string[] | null;
  created_at: string;
}

export interface SendMessageResponse {
  message: AiAssistantMessage;
  providerUsed: "openrouter" | "groq";
  toolsUsed: string[];
}