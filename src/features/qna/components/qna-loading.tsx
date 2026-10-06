// qna/components/qna-loading.tsx

import { Loader2 } from "lucide-react";

interface QnaLoadingCardProps {
  message?: string;
}

export function QnaLoadingCard({
  message = "Menyiapkan...",
}: QnaLoadingCardProps) {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="animate-pulse">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gray-100" />
          <div className="h-5 w-20 rounded-full bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-gray-100" />
          <div className="h-5 w-3/4 rounded bg-gray-100" />
        </div>
        <div className="mt-5 h-28 w-full rounded-xl bg-gray-50" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Loader2 size={14} className="animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}