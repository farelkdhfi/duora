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
      <main className="relative min-h-dvh w-full overflow-hidden bg-primary px-5 py-6 sm:px-8 sm:py-8">
        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-xl flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between">
            <div>
              <div className="h-3 w-10 animate-pulse rounded bg-subprimary/10" />
              <div className="mt-2 h-7 w-36 animate-pulse rounded-lg bg-subprimary/10" />
            </div>

            <div className="size-9 animate-pulse rounded-full bg-subprimary/10" />
          </div>

          {/* Description & Tabs */}
          <div className="mt-7 flex shrink-0 items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-subprimary/10" />
              <div className="h-3 w-28 animate-pulse rounded bg-subprimary/10" />
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/[0.08] bg-subprimary/[0.04] p-1">
              <div className="h-8 w-[78px] animate-pulse rounded-full bg-subprimary/10" />
              <div className="h-8 w-[70px] animate-pulse rounded-full bg-subprimary/[0.06]" />
            </div>
          </div>

          {/* Category Carousel */}
          <section className="relative flex min-h-[420px] flex-1 flex-col items-center justify-center">
            {/* Side cards */}
            <div className="pointer-events-none absolute inset-x-[-36px] top-1/2 h-[260px] -translate-y-1/2 overflow-hidden">
              <div className="absolute left-[-115px] top-7 h-[230px] w-[230px] -rotate-[7deg] animate-pulse rounded-[2rem] bg-subprimary opacity-80" />
              <div className="absolute right-[-115px] top-7 h-[230px] w-[230px] rotate-[7deg] animate-pulse rounded-[2rem] bg-subprimary opacity-80" />
            </div>

            {/* Main card */}
            <div className="relative z-10 h-[330px] w-full max-w-[310px] animate-pulse rounded-[2rem] border border-white/[0.07] bg-subprimary p-6 sm:h-[350px] sm:max-w-[340px]">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-subprimary/[0.09]" />
                <div className="size-8 rounded-full border border-white/[0.08] bg-subprimary/[0.04]" />
              </div>

              {/* Card title */}
              <div className="absolute inset-x-6 bottom-[76px]">
                <div className="h-6 w-36 rounded-md bg-subprimary/[0.10]" />
                <div className="mt-4 h-3 w-48 max-w-full rounded bg-subprimary/[0.07]" />
              </div>

              {/* Card footer */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-subprimary/20" />
                <div className="h-2 w-24 rounded bg-subprimary/[0.07]" />
              </div>
            </div>
          </section>

          {/* Carousel Controls */}
          <div className="flex shrink-0 flex-col items-center pb-1">
            <div className="flex items-center justify-center gap-5">
              <div className="flex size-9 animate-pulse items-center justify-center rounded-full border border-white/[0.08] bg-subprimary/[0.04]">
                <div className="size-3 rounded-full bg-subprimary/10" />
              </div>

              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-5 rounded-full bg-subprimary/20" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="size-1.5 rounded-full bg-subprimary/10"
                  />
                ))}
              </div>

              <div className="flex size-9 animate-pulse items-center justify-center rounded-full border border-white/[0.08] bg-subprimary/[0.04]">
                <div className="size-3 rounded-full bg-subprimary/10" />
              </div>
            </div>

            <div className="mt-4 h-2 w-28 rounded bg-subprimary/[0.06]" />
          </div>
        </div>
      </main>
    );
  }

  if (!relationshipDetails || !profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#050507] px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-subprimary/5">
            <span className="text-sm text-pink-200">♡</span>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight text-secondary">
            Belum terhubung
          </h2>

          <p className="mt-2 text-sm leading-6 text-secondary/50">
            Hubungkan pasanganmu terlebih dahulu untuk mulai menggunakan Q&A
            bersama.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-primary">
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
                <span className="h-px w-7 bg-subprimary/15 sm:w-10" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-secondary/40">
                  Sesi berlanjut
                </span>

                <span className="size-1.5 rounded-full bg-pink-200" />

                <span className="h-px w-7 bg-subprimary/15 sm:w-10" />
              </div>

              {/* Main message */}
              <div className="mt-7 sm:mt-9">
                <h2 className="mx-auto max-w-2xl text-[24px] font-medium leading-[1.05] tracking-[-0.055em] text-secondary sm:text-[52px] md:text-[62px]">
                  {activeSession.partner_has_answered &&
                  !activeSession.my_answer
                    ? "Pasanganmu menunggu :)"
                    : "Mari lanjutkan percakapan ini."}
                </h2>

                <p className="mx-auto mt-5 max-w-md text-[13px] leading-6 text-secondary/60 sm:mt-6 sm:text-[15px]">
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
                className="group flex h-12 w-full items-center justify-center rounded-full bg-subprimary px-6 text-sm font-semibold tracking-[-0.01em] text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-subprimary/90 active:translate-y-0"
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
              <p className="px-1 text-xs font-medium text-secondary/40">
                {showHistory
                  ? "Percakapan yang pernah kalian mulai"
                  : "Pilih sesuatu untuk dibicarakan bersama"}
              </p>

              <div className="flex shrink-0 rounded-full border border-white/10 bg-subprimary/5 p-1 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    !showHistory
                      ? "bg-subprimary text-secondary shadow-sm"
                      : "text-secondary/50 hover:text-secondary"
                  }`}
                >
                  Kategori
                </button>

                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    showHistory
                      ? "bg-subprimary text-secondary shadow-sm"
                      : "text-secondary/50 hover:text-secondary"
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