// app/(dashboard)/ai-assistant/[conversationId]/page.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useMySubscription } from "@/features/subscription/queries";
import {
  useConversationMessages,
  useSendMessage,
  useMessagesSentToday,
} from "@/features/ai-assistant/queries";
import { MessageBubble } from "@/features/ai-assistant/components/message-bubble";
import { ChatInput } from "@/features/ai-assistant/components/chat-input";
import {
  PendingUserBubble,
  TypingIndicator,
} from "@/features/ai-assistant/components/pending-message";
import { AiSidebar } from "@/features/ai-assistant/components/ai-sidebar";

type PendingMessage = {
  id: string;
  text: string;
  /** jumlah pesan di server saat pesan ini dikirim */
  baseline: number;
};

export default function AiAssistantConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return (
    <ConversationView
      key={conversationId}
      conversationId={conversationId}
    />
  );
}

function ConversationView({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();

  const {
    data: relationshipDetails,
    isLoading: isLoadingRelationship,
  } = useMyRelationshipDetails();

  const {
    data: subscription,
    isLoading: isLoadingSubscription,
  } = useMySubscription();

  const relationshipId =
    relationshipDetails?.relationship.id;

  const [sendError, setSendError] =
    useState(false);

  const firstMessageKey =
    `qna-first-message-${conversationId}`;

  // Pesan pertama dari landing dibaca sekali pada render pertama
  const [pending, setPending] =
    useState<PendingMessage | null>(() => {
      if (typeof window === "undefined") {
        return null;
      }

      const text =
        sessionStorage.getItem(firstMessageKey);

      return text
        ? {
            id: "first-message",
            text,
            baseline: 0,
          }
        : null;
    });

  const firstMessageSentRef = useRef(false);
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const {
    data: messages,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationMessages(conversationId);

  const { data: messagesSentToday } =
    useMessagesSentToday();

  const { mutate: sendMessage } =
    useSendMessage();

  const serverCount =
    messages?.length ?? 0;

  // Bubble sementara tampil sampai pesan user muncul dari server
  const showPendingBubble =
    pending !== null &&
    serverCount <= pending.baseline;

  // Menunggu AI sampai balasan muncul di server
  const isWaitingForAi =
    pending !== null &&
    serverCount < pending.baseline + 2;

  const send = useCallback(
    (text: string, baseline: number) => {
      const id = `${Date.now()}`;

      setSendError(false);

      setPending({
        id,
        text,
        baseline,
      });

      sendMessage(
        {
          conversationId,
          message: text,
        },
        {
          onError: () => {
            setPending((p) =>
              p?.id === id ? null : p,
            );

            setSendError(true);
          },

          onSettled: () => {
            refetchMessages().finally(() => {
              setPending((p) =>
                p?.id === id ? null : p,
              );
            });
          },
        },
      );
    },
    [
      conversationId,
      sendMessage,
      refetchMessages,
    ],
  );

  // Kirim pesan pertama dari landing
  useEffect(() => {
    if (firstMessageSentRef.current) {
      return;
    }

    const text =
      sessionStorage.getItem(firstMessageKey);

    if (!text) {
      return;
    }

    firstMessageSentRef.current = true;

    sessionStorage.removeItem(
      firstMessageKey,
    );

    send(text, 0);
  }, [
    firstMessageKey,
    send,
  ]);

  // Bersihkan state sementara setelah balasan AI ada
  useEffect(() => {
    if (
      pending &&
      serverCount >=
        pending.baseline + 2
    ) {
      setPending(null);
    }
  }, [
    pending,
    serverCount,
  ]);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [
    serverCount,
    pending?.id,
    isWaitingForAi,
    sendError,
  ]);

  const planType =
    subscription?.plan_type ?? "free";

  const isActivePlan =
    subscription?.status === "active" ||
    subscription?.status === "trialing";

  const hasAccess =
    isActivePlan &&
    (planType === "plus" ||
      planType === "pro");

  const dailyLimit =
    planType === "pro"
      ? 20
      : planType === "plus"
        ? 5
        : 0;

  const isLimitReached =
    (messagesSentToday ?? 0) >=
    dailyLimit;

  if (
    isLoadingRelationship ||
    isLoadingSubscription
  ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500" />
          Memuat Duora AI...
        </div>
      </div>
    );
  }

  if (!relationshipDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafaf9] px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900">
            <Sparkles
              size={22}
              className="text-white"
            />
          </div>

          <h1 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">
            Hubungkan pasanganmu dulu
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Duora AI membutuhkan hubungan
            yang terhubung agar dapat
            memahami konteks hubungan
            kalian.
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafaf9] px-6">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 opacity-15 blur-xl" />
          </div>

          <h1 className="mt-7 text-2xl font-semibold tracking-tight text-neutral-950">
            Duora AI
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
            Assistant pribadi untuk membantu
            memahami hubungan, membaca pola,
            dan menemukan perspektif baru
            tentang kalian.
          </p>

          <div className="mt-7 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <Sparkles
                  size={16}
                  className="text-neutral-700"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Tersedia di Plus & Pro
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Upgrade untuk mulai
                  menggunakan Duora AI dan
                  mendapatkan insight yang lebih
                  personal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleSend(text: string) {
    if (isWaitingForAi) {
      return;
    }

    send(text, serverCount);
  }

  const showSkeleton =
    isLoadingMessages &&
    serverCount === 0 &&
    !pending;

  const showEmpty =
    !isLoadingMessages &&
    serverCount === 0 &&
    !pending;

  return (
    <div className="fixed inset-0 z-50 flex min-h-0 overflow-hidden bg-white">
      {/* =========================
          SHARED AI SIDEBAR
      ========================== */}
      <AiSidebar
        relationshipId={relationshipId!}
        activeConversationId={conversationId}
        messagesSentToday={messagesSentToday ?? 0}
        dailyLimit={dailyLimit}
        onSelectConversation={(conversation) => {
          router.push(
            `/ai-assistant/${conversation.id}`,
          );
        }}
        onNewConversation={() => {
          router.push("/ai-assistant");
        }}
      />

      {/* =========================
          MAIN CHAT
      ========================== */}
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

        {/* =========================
            MESSAGES
        ========================== */}
        <div
          ref={scrollRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-2xl space-y-4 px-5 pb-8 pt-20 sm:px-8 md:pt-10">
            {showSkeleton && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="h-10 w-48 animate-pulse rounded-2xl bg-neutral-200/70" />
                </div>

                <div className="h-16 w-72 animate-pulse rounded-2xl bg-neutral-200/50" />

                <div className="flex justify-end">
                  <div className="h-10 w-36 animate-pulse rounded-2xl bg-neutral-200/70" />
                </div>
              </div>
            )}

            {showEmpty && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950">
                  <Sparkles
                    size={20}
                    className="text-white"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-neutral-800">
                  Belum ada pesan
                </p>

                <p className="mt-1 text-xs text-neutral-400">
                  Mulai percakapan lewat kolom
                  di bawah.
                </p>
              </div>
            )}

            {messages?.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}

            {showPendingBubble &&
              pending && (
                <PendingUserBubble
                  text={pending.text}
                />
              )}

            {isWaitingForAi && (
              <TypingIndicator />
            )}

            {sendError && (
              <div className="rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-center text-xs text-red-600">
                Pesan gagal dikirim. Silakan
                coba lagi.
              </div>
            )}
          </div>
        </div>

        {/* =========================
            BOTTOM COMPOSER
        ========================== */}
        <div className="relative z-10 shrink-0 px-4 pb-4 pt-2 sm:px-8 sm:pb-6">
          <div className="mx-auto w-full max-w-2xl">
            <ChatInput
              onSend={handleSend}
              isSending={isWaitingForAi}
              disabled={isLimitReached}
              disabledMessage={`Kamu sudah mencapai batas ${dailyLimit} pesan hari ini. Coba lagi besok, atau upgrade untuk kuota lebih besar.`}
            />

            <div className="mt-2.5 flex items-center justify-center gap-2">
              <span className="text-[10px] text-neutral-400">
                {messagesSentToday ?? 0}/
                {dailyLimit} pesan hari ini
              </span>

              <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />

              <span className="text-[10px] text-neutral-400">
                Duora AI dapat membuat
                kesalahan
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}