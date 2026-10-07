"use client";

import { useState } from "react";
import { ArrowLeft, Menu, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConversationHistory } from "@/features/ai-assistant/components/conversation-history";

type Conversation = {
  id: string;
};

type AiSidebarProps = {
  relationshipId: string;
  activeConversationId?: string;
  messagesSentToday: number;
  dailyLimit: number;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
};

export function AiSidebar({
  relationshipId,
  activeConversationId,
  messagesSentToday,
  dailyLimit,
  onSelectConversation,
  onNewConversation,
}: AiSidebarProps) {
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const usagePercentage = Math.min(
    ((messagesSentToday ?? 0) / Math.max(dailyLimit, 1)) * 100,
    100,
  );

  function handleSelectConversation(
    conversation: Conversation,
  ) {
    onSelectConversation(conversation);
    setIsMobileOpen(false);
  }

  function handleNewConversation() {
    onNewConversation();
    setIsMobileOpen(false);
  }

  function handleBackToDashboard() {
    setIsMobileOpen(false);
    router.push("/dashboard");
  }

  return (
    <>
      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="hidden w-[280px] shrink-0 border-r border-neutral-200/80 bg-[#f7f7f5] md:flex md:flex-col">
        <div className="flex h-full min-h-0 flex-col p-3">
          {/* HEADER */}
          <div className="mb-5 flex items-center justify-between px-2 py-1">
            <div>
              <p className="text-[13px] font-semibold tracking-tight text-neutral-900">
                Duora AI
              </p>

              <p className="text-[10px] text-neutral-400">
                Relationship assistant
              </p>
            </div>
          </div>

          {/* RECENT CHAT LABEL */}
          <div className="mb-2 px-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
              Recent chat
            </p>
          </div>

          {/* CONVERSATION HISTORY */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl pr-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
            <ConversationHistory
              relationshipId={relationshipId}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="mt-3 shrink-0 space-y-2">
            {/* NEW CONVERSATION */}
            <button
              type="button"
              onClick={handleNewConversation}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-800 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99]"
            >
              <Plus size={15} />
              New chat
            </button>

            {/* BACK TO DASHBOARD */}
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.99]"
            >
              Back to dashboard
            </button>
          </div>

          {/* DAILY USAGE */}
          <div className="mt-3 shrink-0 rounded-xl border border-neutral-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                Daily usage
              </span>

              <span className="text-[11px] font-medium text-neutral-600">
                {messagesSentToday}/{dailyLimit}
              </span>
            </div>

            <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                style={{
                  width: `${usagePercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* =========================
          MOBILE HEADER TRIGGER
      ========================== */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:hidden">
        <button
          type="button"
          aria-label="Buka sidebar"
          onClick={() => setIsMobileOpen(true)}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 bg-white/85 text-neutral-600 shadow-sm backdrop-blur-xl transition hover:bg-white active:scale-95"
        >
          <Menu size={17} />
        </button>

        <div className="pointer-events-auto flex items-center rounded-full border border-neutral-200/80 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-xl">
          <span className="text-[11px] font-medium text-neutral-700">
            Duora AI
          </span>
        </div>

        <div className="w-9" />
      </div>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[70] flex md:hidden">
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Tutup sidebar"
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-neutral-950/30 backdrop-blur-[2px]"
          />

          {/* DRAWER */}
          <aside className="relative z-10 flex h-full w-[300px] flex-col bg-[#f7f7f5] shadow-2xl">
            {/* DRAWER HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200/80 px-4 py-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-neutral-900">
                  Duora AI
                </p>

                <p className="text-[10px] text-neutral-400">
                  Relationship assistant
                </p>
              </div>

              <button
                type="button"
                aria-label="Tutup sidebar"
                onClick={() => setIsMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white hover:text-neutral-700 active:scale-95"
              >
                <X size={17} />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="flex min-h-0 flex-1 flex-col p-3">
              {/* RECENT CHAT LABEL */}
              <div className="mb-2 shrink-0 px-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Recent chat
                </p>
              </div>

              {/* HISTORY */}
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl pr-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                <ConversationHistory
                  relationshipId={relationshipId}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                />
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="mt-3 shrink-0 space-y-2">
                {/* NEW CONVERSATION */}
                <button
                  type="button"
                  onClick={handleNewConversation}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-800 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 active:scale-[0.99]"
                >
                  <Plus size={15} />
                  New chat
                </button>

                {/* BACK TO DASHBOARD */}
                <button
                  type="button"
                  onClick={handleBackToDashboard}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.99]"
                >
                  Back to dashboard
                </button>
              </div>

              {/* MOBILE USAGE */}
              <div className="mt-3 shrink-0 rounded-xl border border-neutral-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                    Daily usage
                  </span>

                  <span className="text-[11px] font-medium text-neutral-600">
                    {messagesSentToday}/{dailyLimit}
                  </span>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                    style={{
                      width: `${usagePercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}