import { Sparkles } from "lucide-react";

export function PendingUserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-pink-500 px-4 py-2.5 text-sm leading-6 text-white shadow-sm sm:max-w-[75%]">
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500">
          <Sparkles size={9} className="text-white" />
        </div>

        <span className="text-[10px] font-medium text-neutral-400">
          Duora AI
        </span>
      </div>

      <div
        className="inline-flex items-center gap-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm"
        aria-label="Duora AI sedang mengetik"
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}