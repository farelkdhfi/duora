"use client";

import { useState } from "react";
import {
  Check,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useMyConversations,
  useDeleteConversation,
} from "../queries";
import type { AiAssistantConversation } from "../types";

interface ConversationHistoryProps {
  relationshipId: string;
  activeConversationId: string | undefined;
  onSelectConversation: (
    conversation: AiAssistantConversation,
  ) => void;
  onNewConversation: () => void;
}

export function ConversationHistory({
  relationshipId,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationHistoryProps) {
  const {
    data: conversations,
    isLoading,
  } = useMyConversations(relationshipId);

  const {
    mutate: deleteConversation,
  } = useDeleteConversation(relationshipId);

  const [confirmDeleteId, setConfirmDeleteId] =
    useState<string | null>(null);

  function handleDelete(
    e: React.MouseEvent,
    conversationId: string,
  ) {
    e.stopPropagation();

    if (confirmDeleteId === conversationId) {
      deleteConversation(conversationId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(conversationId);

      window.setTimeout(() => {
        setConfirmDeleteId((current) =>
          current === conversationId ? null : current,
        );
      }, 3000);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {isLoading ? (
          <div className="space-y-2 px-1 pt-1">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[54px] animate-pulse rounded-xl bg-white/[0.06]"
              />
            ))}
          </div>
        ) : !conversations ||
          conversations.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
              <MessageSquare
                size={15}
                className="text-description"
              />
            </div>

            <p className="mt-3 text-[11px] font-medium text-description">
              Belum ada percakapan
            </p>

            <p className="mt-1 text-[10px] leading-4 text-description/70">
              Mulai percakapan baru dengan DUONEAR AI.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive =
              conv.id === activeConversationId;

            const isConfirmingDelete =
              confirmDeleteId === conv.id;

            return (
              <div
                key={conv.id}
                className={`group relative flex w-full items-center rounded-xl transition ${
                  isActive
                    ? "bg-white/[0.08] shadow-sm"
                    : "hover:bg-white/[0.05]"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelectConversation(conv)
                  }
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-xs font-medium ${
                        isActive
                          ? "text-secondary"
                          : "text-description"
                      }`}
                    >
                      {conv.title ||
                        "Percakapan baru"}
                    </p>

                    <p className="mt-0.5 text-[9px] text-description/70">
                      {new Date(
                        conv.updated_at,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) =>
                    handleDelete(e, conv.id)
                  }
                  aria-label={
                    isConfirmingDelete
                      ? "Konfirmasi hapus"
                      : "Hapus percakapan"
                  }
                  className={`mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                    isConfirmingDelete
                      ? "bg-red-500/10 text-red-400 opacity-100"
                      : "text-description/60 opacity-0 hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  }`}
                >
                  {isConfirmingDelete ? (
                    <Check size={13} />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}