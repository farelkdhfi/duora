// qna/api.ts

import { createClient } from "@/lib/supabase/client";
import type {
  QnaQuestion,
  ActiveQnaSession,
  QnaSessionDetail,
  QnaHistoryItem,
  QnaCategory,
} from "./types";

const supabase = createClient();

export async function getRandomQuestion(
  category: QnaCategory
): Promise<QnaQuestion> {
  const { data, error } = await supabase.rpc("get_random_qna_question", {
    p_category: category,
  });

  if (error) throw error;
  return data;
}

export async function startSession(questionId: string) {
  const { data, error } = await supabase.rpc("start_qna_session", {
    p_question_id: questionId,
  });

  if (error) throw error;
  return data;
}

export async function submitAnswer(sessionId: string, answerText: string) {
  const { data, error } = await supabase.rpc("submit_qna_answer", {
    p_session_id: sessionId,
    p_answer_text: answerText,
  });

  if (error) throw error;
  return data;
}

export async function getActiveSession(): Promise<ActiveQnaSession | null> {
  const { data, error } = await supabase.rpc("get_active_qna_session");
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getSessionDetail(
  sessionId: string
): Promise<QnaSessionDetail> {
  const { data, error } = await supabase.rpc("get_qna_session_detail", {
    p_session_id: sessionId,
  });

  if (error) throw error;
  return data?.[0];
}

export async function getHistory(
  limit: number = 20,
  offset: number = 0
): Promise<QnaHistoryItem[]> {
  const { data, error } = await supabase.rpc("get_qna_history", {
    p_limit: limit,
    p_offset: offset,
  });

  if (error) throw error;
  return data ?? [];
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabase.rpc("delete_qna_session", {
    p_session_id: sessionId,
  });

  if (error) throw error;
}

export async function getSessionsCreatedToday(): Promise<number> {
  const { data, error } = await supabase.rpc("get_qna_sessions_created_today");
  if (error) throw error;
  return data as number;
}

export async function rerollQuestion(sessionId: string) {
  const { data, error } = await supabase.rpc("reroll_qna_question", {
    p_session_id: sessionId,
  });

  if (error) throw error;
  return data;
}