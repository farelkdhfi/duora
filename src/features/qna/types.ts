// qna/types.ts

export type QnaCategory =
  | "love_and_us"
  | "deep_talk"
  | "future"
  | "memories"
  | "fun_and_random";

export type QnaSessionStatus = "pending" | "completed";

export interface QnaQuestion {
  id: string;
  category: QnaCategory;
  question_text: string;
  is_active: boolean;
  created_at: string;
}

export interface ActiveQnaSession {
  session_id: string;
  question_id: string;
  question_text: string;
  category: QnaCategory;
  status: QnaSessionStatus;
  my_answer: string | null;
  my_submitted_at: string | null;
  partner_has_answered: boolean;
  created_at: string;
}

export interface QnaSessionDetail {
  session_id: string;
  question_text: string;
  category: QnaCategory;
  status: QnaSessionStatus;
  answer_a_user_id: string | null;
  answer_a_text: string | null;
  answer_a_submitted_at: string | null;
  answer_b_user_id: string | null;
  answer_b_text: string | null;
  answer_b_submitted_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface QnaHistoryItem {
  session_id: string;
  question_text: string;
  category: QnaCategory;
  status: QnaSessionStatus;
  completed_at: string | null;
  created_at: string;
}