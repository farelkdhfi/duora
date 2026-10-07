"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [input]);

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
      className="relative rounded-[22px] border border-neutral-200 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.07)] transition focus-within:border-neutral-300 focus-within:shadow-[0_14px_45px_rgba(0,0,0,0.09)]"
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
        placeholder="Tanya sesuatu tentang hubungan kalian..."
        rows={1}
        className="block max-h-[180px] min-h-[52px] w-full resize-none bg-transparent px-3 py-3 pr-14 text-sm leading-6 text-neutral-900 outline-none placeholder:text-neutral-400"
      />

      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-[10px] text-neutral-300">
          Duora AI can make mistakes, please crosscheck.
        </p>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Kirim pesan"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowUp size={17} strokeWidth={2.2} />
          )}
        </button>
      </div>
    </form>
  );
}