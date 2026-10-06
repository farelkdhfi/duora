// notifications/types.ts

export type NotificationType = "qna_waiting_answer" | "qna_completed";

export interface Notification {
  id: string;
  relationship_id: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}