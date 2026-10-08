"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Sparkles } from "lucide-react";

import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useMySubscription } from "@/features/subscription/queries";
import {
  useMessagesSentToday,
  useStartNewConversation,
} from "@/features/ai-assistant/queries";
import { ChatInput } from "@/features/ai-assistant/components/chat-input";
import {
  PendingUserBubble,
  TypingIndicator,
} from "@/features/ai-assistant/components/pending-message";
import LoveWave from "@/components/ui/love-wave";
import { AiSidebar } from "@/features/ai-assistant/components/ai-sidebar";

export default function AiAssistantLandingPage() {
  const router = useRouter();

  const {
    data: relationshipDetails,
    isLoading: isLoadingRelationship,
  } = useMyRelationshipDetails();

  const { data: subscription, isLoading: isLoadingSubscription } =
    useMySubscription();

  const { data: messagesSentToday } = useMessagesSentToday();

  const { mutate: startNewConversation } = useStartNewConversation(
    relationshipDetails?.relationship.id ?? "",
  );

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const relationshipId = relationshipDetails?.relationship.id;

  const planType = subscription?.plan_type ?? "free";

  const isActivePlan =
    subscription?.status === "active" ||
    subscription?.status === "trialing";

  const hasAccess =
    isActivePlan &&
    (planType === "plus" || planType === "pro");

  const dailyLimit =
    planType === "pro"
      ? 20
      : planType === "plus"
        ? 5
        : 0;

  const isLimitReached =
    (messagesSentToday ?? 0) >= dailyLimit;

  const isStartingChat = pendingMessage !== null;

  function handleFirstMessage(text: string) {
    if (isStartingChat || isLimitReached) return;

    setPendingMessage(text);

    startNewConversation(undefined, {
      onSuccess: (newConv) => {
        sessionStorage.setItem(
          `qna-first-message-${newConv.id}`,
          text,
        );

        router.push(`/ai-assistant/${newConv.id}`);
      },
      onError: () => {
        setPendingMessage(null);
      },
    });
  }

  if (isLoadingRelationship || isLoadingSubscription) {
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
            <Sparkles size={22} className="text-white" />
          </div>

          <h1 className="mt-5 text-lg font-semibold tracking-tight text-neutral-900">
            Hubungkan pasanganmu dulu
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Duora AI membutuhkan hubungan yang terhubung agar dapat
            memahami konteks hubungan kalian.
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

            <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-neutral-950 shadow-xl shadow-neutral-900/10">
              <Sparkles
                size={27}
                className="text-white"
              />
            </div>
          </div>

          <h1 className="mt-7 text-2xl font-semibold tracking-tight text-neutral-950">
            Duora AI
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
            Assistant pribadi untuk membantu memahami hubungan,
            membaca pola, dan menemukan perspektif baru tentang kalian.
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
                  Upgrade untuk mulai menggunakan Duora AI
                  dan mendapatkan insight yang lebih personal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-0 overflow-hidden bg-white">
      <AiSidebar
        relationshipId={relationshipId!}
        activeConversationId={undefined}
        messagesSentToday={messagesSentToday ?? 0}
        dailyLimit={dailyLimit}
        onSelectConversation={(conversation) => {
          router.push(
            `/ai-assistant/${conversation.id}`,
          );
        }}
        onNewConversation={() => {
          setPendingMessage(null);
        }}
      />

      {/* =========================
          MAIN
      ========================== */}
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* =========================
            CHAT STARTED
        ========================== */}
        {pendingMessage ? (
          <>
            <div className="relative min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto flex w-full max-w-2xl flex-col space-y-4 px-5 pb-8 pt-20 sm:px-8 sm:pt-10">
                <PendingUserBubble text={pendingMessage} />
                <TypingIndicator />
              </div>
            </div>

            <div className="relative z-10 shrink-0 px-4 pb-4 pt-2 sm:px-8 sm:pb-6">
              <div className="mx-auto w-full max-w-2xl">
                {/*
                  FIX: `disabled` hanya untuk limit harian.
                  Status "sedang mengirim" cukup lewat `isSending`,
                  supaya kotak peringatan limit tidak muncul sesaat.
                */}
                <ChatInput
                  onSend={handleFirstMessage}
                  isSending={isStartingChat}
                  disabled={isLimitReached}
                  disabledMessage={`Batas ${dailyLimit} pesan hari ini sudah tercapai. Coba lagi besok.`}
                />

                <div className="mt-2 flex items-center justify-center">
                  <span className="text-[10px] text-neutral-400">
                    Duora AI dapat membuat kesalahan
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* =========================
                WELCOME
            ========================== */}
            <div className="relative min-h-0 flex-1 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center px-5 pb-10 pt-16 sm:px-8">
                <div className="w-full max-w-2xl">
                  <div className="flex flex-col items-center text-center">
                    <LoveWave />

                    <div className="-mt-1">
                      <h1 className="text-2xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-[36px]">
                        Ceritakan tentang kalian.
                      </h1>

                      <p className="mx-auto mt-3 max-w-xl text-[13px] leading-6 text-neutral-500 sm:text-sm">
                        Tanyakan apa pun tentang hubungan kalian.
                        Duora AI dapat memahami konteks dari mood,
                        goals, planner, Q&A, dan percakapan sebelumnya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================
                BOTTOM COMPOSER
            ========================== */}
            <div className="relative z-10 shrink-0 px-4 pb-4 pt-2 sm:px-8 sm:pb-6">
              <div className="mx-auto w-full max-w-2xl">
                <ChatInput
                  onSend={handleFirstMessage}
                  isSending={false}
                  disabled={isLimitReached}
                  disabledMessage={`Batas ${dailyLimit} pesan hari ini sudah tercapai. Coba lagi besok.`}
                />

                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <span className="text-[10px] text-neutral-400">
                    {messagesSentToday ?? 0}/{dailyLimit} pesan hari ini
                  </span>

                  <span className="h-0.5 w-0.5 rounded-full bg-neutral-300" />

                  <span className="text-[10px] text-neutral-400">
                    Duora AI dapat membuat kesalahan
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}