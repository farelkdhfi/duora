// countdown/utils.ts

import type { CountdownMember } from "./types";

export function getMemberName(
  members: CountdownMember[],
  userId: string | null
): string {
  if (!userId) return "-";
  const member = members.find((m) => m.user_id === userId);
  return member?.display_name ?? "Pasangan";
}