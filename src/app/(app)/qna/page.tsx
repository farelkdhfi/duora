"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useActiveSession } from "@/features/qna/queries";
import { useQnaRealtime } from "@/features/qna/use-qna-realtime";
import { CategoryPicker } from "@/features/qna/components/category-picker";
import { QnaHistoryList } from "@/features/qna/components/qna-history";
import { useGetMyProfile } from "@/features/profiles/queries";

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

  const isLoading =
    isLoadingRelationship || isLoadingProfile || isLoadingSession;

  if (isLoading) {
    return (
      <main className="min-h-dvh w-full bg-[#fafaf9] px-5 py-7 sm:px-8 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-xl flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-3 w-20 animate-pulse rounded-full bg-black/[0.06]" />
              <div className="mt-3 h-9 w-56 animate-pulse rounded-xl bg-black/[0.06]" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-black/[0.06]" />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="h-[340px] w-full animate-pulse rounded-[2rem] bg-black/[0.035]" />
          </div>

          <div className="h-13 w-full animate-pulse rounded-full bg-black/[0.05]" />
        </div>
      </main>
    );
  }

  if (!relationshipDetails || !profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#fafaf9] px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#1e1318]">
            <span className="text-sm text-white">♡</span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-[#171717]">
            Belum terhubung
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/45">
            Hubungkan pasanganmu terlebih dahulu untuk mulai menggunakan Q&A
            bersama.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#ffffff]">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute left-1/2 top-[35%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/[0.12] blur-[130px]" />

        <div className="absolute left-[20%] top-[20%] size-[260px] rounded-full bg-pink-200/[0.08] blur-[110px]" />

        <div className="absolute bottom-[-100px] right-[10%] size-[300px] rounded-full bg-purple-200/[0.06] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_68%)]" />
      </div>

      <div className="relative z-10 flex min-h-dvh w-full flex-col px-5 py-7 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Q&A for two
            </p>

            <h1 className="mt-2 text-[28px] font-medium leading-tight tracking-[-0.045em] text-neutral-950 sm:text-[32px]">
              A little closer.
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            aria-label="Back to dashboard"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-neutral-800 text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-neutral-900 active:scale-95"
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        </header>

        {activeSession ? (
          /* ---------------------------------------------------------------- */
          /* ACTIVE SESSION                                                    */
          /* ---------------------------------------------------------------- */
          <section className="relative flex flex-1 items-center justify-center">
            {/* Center ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/[0.10] blur-[120px]"
            />

            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-2 pb-20 text-center sm:pb-24">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-7 bg-black/10 sm:w-10" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-black/30">
                  Sesi berlanjut
                </span>

                <span className="size-1.5 rounded-full bg-[#c995b5]" />

                <span className="h-px w-7 bg-black/10 sm:w-10" />
              </div>

              {/* Main message */}
              <div className="mt-7 sm:mt-9">
                <h2 className="mx-auto max-w-2xl text-[36px] font-medium leading-[1.05] tracking-[-0.055em] text-[#171717] sm:text-[52px] md:text-[62px]">
                  {activeSession.partner_has_answered &&
                  !activeSession.my_answer
                    ? "Pasanganmu menunggu jawabanmu."
                    : "Mari lanjutkan percakapan ini."}
                </h2>

                <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-black/40 sm:mt-6 sm:text-[15px]">
                  {activeSession.partner_has_answered &&
                  !activeSession.my_answer
                    ? "Satu jawaban kecil darimu bisa membuat kalian saling memahami sedikit lebih dalam."
                    : "Kembali ke pertanyaan yang kalian tinggalkan dan lanjutkan cerita kalian."}
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="absolute inset-x-0 bottom-0 z-20 px-0 pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => router.push("/qna/session")}
                className="group flex h-13 w-full items-center justify-center rounded-full bg-[#1e1318] px-6 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0"
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
              <p className="px-1 text-xs font-medium text-neutral-400">
                {showHistory
                  ? "Percakapan yang pernah kalian mulai"
                  : "Pilih sesuatu untuk dibicarakan bersama"}
              </p>

              <div className="flex shrink-0 rounded-full border border-black/[0.05] bg-white/60 p-1 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    !showHistory
                      ? "bg-[#1e1318] text-white shadow-sm"
                      : "text-black/35 hover:text-black/60"
                  }`}
                >
                  Kategori
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    showHistory
                      ? "bg-[#1e1318] text-white shadow-sm"
                      : "text-black/35 hover:text-black/60"
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