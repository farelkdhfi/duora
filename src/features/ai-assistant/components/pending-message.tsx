
export function PendingUserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm leading-6 text-secondary shadow-md sm:max-w-[75%]">
        {text}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="space-y-1.5">
      <div
        className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-primary px-4 py-3.5 shadow-sm"
        aria-label="DUONEAR AI sedang mengetik"
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-description"
            style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}