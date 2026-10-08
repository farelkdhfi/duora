"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2, SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

export function ChatInput({
  onSend,
  isSending,
  disabled,
  disabledMessage,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
  const textarea = textareaRef.current;

  if (!textarea) return;

  textarea.style.height = "auto";

  const { scrollHeight } = textarea;

  textarea.style.height = `${Math.min(scrollHeight, 180)}px`;

  // Kosong → kembali sejajar. Lebih dari 1 baris → pindah ke layout expanded.
  // Collapse hanya saat kosong supaya layout tidak flicker bolak-balik.
  if (!input) {
    setIsExpanded(false);
  } else if (scrollHeight > 48) {
    setIsExpanded(true);
  }
}

useEffect(() => {
  resizeTextarea();
}, [input, isExpanded]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const message = input.trim();

    if (!message || isSending || disabled) return;

    setInput("");
    onSend(message);
  }

  if (disabled) {
    return (
      <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3.5 text-center shadow-sm">
        <p className="text-xs font-medium text-amber-700">
          Batas pesan hari ini sudah tercapai
        </p>

        <p className="mt-1 text-[10px] leading-4 text-amber-600/70">
          {disabledMessage ??
            "Coba lagi besok untuk melanjutkan percakapan."}
        </p>
      </div>
    );
  }

  const canSend = Boolean(input.trim()) && !isSending;

  return (
  <form
    onSubmit={handleSubmit}
    className={`flex gap-2 rounded-[22px] border border-neutral-200 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.07)] transition focus-within:border-neutral-300 focus-within:shadow-[0_14px_45px_rgba(0,0,0,0.09)] ${
      isExpanded ? "flex-col" : "flex-row items-end"
    }`}
  >
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      }}
      placeholder="Tanya sesuatu..."
      rows={1}
      className={`min-h-[44px] max-h-[180px] min-w-0 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm leading-6 text-neutral-900 outline-none placeholder:text-neutral-400 ${
        isExpanded ? "w-full" : "flex-1"
      }`}
    />

    {/* Mode 1 baris: sejajar di kanan. Mode panjang: container w-full sendiri di bawah */}
    <div
      className={
        isExpanded
          ? "flex w-full items-center justify-end px-1 pb-0.5"
          : "mb-0.5 shrink-0"
      }
    >
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Kirim pesan"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
      >
        {isSending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <SendHorizonal size={14} strokeWidth={2.2} />
        )}
      </button>
    </div>
  </form>
);
}