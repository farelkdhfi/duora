"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import {
  useActiveSession,
  useStartedQnaThisVisit,
} from "@/features/qna/queries";
import { useQnaRealtime } from "@/features/qna/use-qna-realtime";
import { CategoryPicker } from "@/features/qna/components/category-picker";
import { QnaHistoryList } from "@/features/qna/components/qna-history";
import { useGetMyProfile } from "@/features/profiles/queries";
import HeaderWithoutShell from "@/components/layout/header-without-shell";

export default function QnaMenuPage() {
  const router = useRouter();

  const { data: relationshipDetails, isLoading: isLoadingRelationship } =
    useMyRelationshipDetails();

  const { data: profile, isLoading: isLoadingProfile } = useGetMyProfile();

  const relationshipId = relationshipDetails?.relationship.id;

  const [showHistory, setShowHistory] = useState(false);

  useQnaRealtime({ relationshipId });

  const { data: activeSession, isLoading: isLoadingSession } =
    useActiveSession();

  // True kalau user baru saja membuat sesi dari halaman ini. Selama itu,
  // "Sesi berlanjut" tidak ditampilkan karena user sedang diarahkan otomatis
  // ke /qna/session.
  const startedHere = useStartedQnaThisVisit();

  const isLoading =
    isLoadingRelationship || isLoadingProfile || isLoadingSession;

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-[#050507] px-5 py-7 sm:px-8 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-xl flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-9 w-56 animate-pulse rounded-xl bg-white/[0.08]" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-white/[0.08]" />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="h-[340px] w-full animate-pulse rounded-[2rem] bg-white/[0.05]" />
          </div>

          <div className="h-13 w-full animate-pulse rounded-full bg-white/[0.07]" />
        </div>
      </main>
    );
  }

  if (!relationshipDetails || !profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#050507] px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <span className="text-sm text-pink-200">♡</span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">
            Belum terhubung
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Hubungkan pasanganmu terlebih dahulu untuk mulai menggunakan Q&A
            bersama.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#050507]">
      <div className="relative z-10 flex min-h-dvh w-full flex-col px-5 py-7 sm:px-8 sm:py-10">
        {/* Header */}
        <HeaderWithoutShell title="Q&A" text="A little closer" />

        {activeSession && !startedHere ? (
          /* ---------------------------------------------------------------- */
          /* ACTIVE SESSION                                                    */
          /* ---------------------------------------------------------------- */
          <section className="relative flex flex-1 items-center justify-center">
            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-2 pb-20 text-center sm:pb-24">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-7 bg-white/15 sm:w-10" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Sesi berlanjut
                </span>

                <span className="size-1.5 rounded-full bg-pink-200" />

                <span className="h-px w-7 bg-white/15 sm:w-10" />
              </div>

              {/* Main message */}
              <div className="mt-7 sm:mt-9">
                <h2 className="mx-auto max-w-2xl text-[24px] font-medium leading-[1.05] tracking-[-0.055em] text-white sm:text-[52px] md:text-[62px]">
                  {activeSession.partner_has_answered &&
                  !activeSession.my_answer
                    ? "Pasanganmu menunggu :)"
                    : "Mari lanjutkan percakapan ini."}
                </h2>

                <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-white/60 sm:mt-6 sm:text-[15px]">
                  {activeSession.partner_has_answered &&
                  !activeSession.my_answer
                    ? "Sekarang giliranmu untuk menjawab."
                    : "Salah satu dari kalian sudah membuat sesi Q&A ayo lanjutkan."}
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-0 pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => router.push("/qna/session")}
                className="group flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold tracking-[-0.01em] text-neutral-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 active:translate-y-0"
              >
                Lanjutkan sesi
              </button>
            </div>
          </section>
        ) : (
          /* ---------------------------------------------------------------- */
          /* CATEGORY / HISTORY                                                */
          /* ---------------------------------------------------------------- */
          <>
            {/* Small navigation */}
            <div className="mt-7 flex shrink-0 items-center justify-between gap-4">
              <p className="px-1 text-xs font-medium text-white/40">
                {showHistory
                  ? "Percakapan yang pernah kalian mulai"
                  : "Pilih sesuatu untuk dibicarakan bersama"}
              </p>

              <div className="flex shrink-0 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    !showHistory
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Kategori
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    showHistory
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Riwayat
                </button>
              </div>
            </div>

            {/* Main content */}
            <section className="flex flex-1 items-center justify-center">
              {showHistory ? (
                <div className="w-full max-w-xl py-8">
                  <QnaHistoryList currentUserId={profile.id} />
                </div>
              ) : (
                <div className="w-full py-6">
                  <CategoryPicker />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}