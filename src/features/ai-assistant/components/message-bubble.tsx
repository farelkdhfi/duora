"use client";

import { memo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Check, Copy, Database, Sparkles } from "lucide-react";
import type { AiAssistantMessage } from "../types";

interface MessageBubbleProps {
  message: AiAssistantMessage;
}

const TOOL_LABELS: Record<string, string> = {
  get_mood_summary: "Mood Check-in",
  get_goals_summary: "Couple Goals",
  get_qna_history: "Riwayat Q&A",
  get_debate_history: "Riwayat AI Debate",
  get_planner_events: "Planner",
};


export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-neutral-100 px-4 py-2.5 text-sm leading-6 text-black shadow-md sm:max-w-[75%]">
        {children}
      </div>
    </div>
  );
}

/* ---------- Markdown styling ---------- */

const markdownComponents: Components = {
  p: ({ children }) => <p className="my-2.5">{children}</p>,

  h1: ({ children }) => (
    <h1 className="mb-2 mt-5 text-base font-semibold tracking-tight text-neutral-950">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 text-[15px] font-semibold tracking-tight text-neutral-950">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1.5 mt-4 text-sm font-semibold text-neutral-900">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-3 text-sm font-medium text-neutral-900">
      {children}
    </h4>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-950">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => (
    <del className="text-neutral-400 line-through">{children}</del>
  ),

  ul: ({ children }) => (
    <ul className="my-2.5 list-disc space-y-1.5 pl-5 marker:text-neutral-300 [&_ol]:mt-1.5 [&_ul]:mt-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 list-decimal space-y-1.5 pl-5 marker:font-medium marker:text-neutral-400 [&_ol]:mt-1.5 [&_ul]:mt-1.5">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition hover:decoration-neutral-900"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-neutral-200 pl-4 text-neutral-500">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-5 border-neutral-200/80" />,

  code: ({ className, children }) => (
    <code
      className={`rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-800 ${
        className ?? ""
      }`}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12.5px] leading-6 text-neutral-100 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em] [&>code]:text-inherit">
      {children}
    </pre>
  ),

  table: ({ children }) => (
    <div className="my-3.5 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-max border-collapse text-left text-[13px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-50 text-neutral-500">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-neutral-100">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-neutral-50/70">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="whitespace-nowrap border-b border-neutral-200 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3.5 py-2.5 align-top text-neutral-700">{children}</td>
  ),
};

const remarkPlugins = [remarkGfm, remarkBreaks];

/* ---------- Message bubble ---------- */

function MessageBubbleBase({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  if (isUser) {
    return <UserBubble>{message.content}</UserBubble>;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard tidak tersedia, abaikan
    }
  }

  const tools = message.tools_used ?? [];

  return (
    <div className="group flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="break-words text-[14.5px] leading-7 text-neutral-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-500"
            >
              <Database size={9} />
              {TOOL_LABELS[tool] ?? tool}
            </span>
          ))}

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Salin balasan"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleBase);