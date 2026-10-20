"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { getQnaErrorKey, type QnaErrorKey } from "../errors";
import { useRerollQuestion } from "../queries";
import type { ActiveQnaSession } from "../types";

import logo from "@/assets/logo-white.png";

interface QuestionCardProps {
  session: ActiveQnaSession;
  /** Dipanggil setiap status shuffle berubah, supaya input bisa ikut dikunci. */
  onShufflingChange?: (shuffling: boolean) => void;
}

/**
 * Durasi satu putaran animasi shuffle (ms). Shuffle selalu berjalan dalam
 * kelipatan putaran penuh, supaya berhentinya pas saat kartu putih di atas.
 */
const SHUFFLE_CYCLE_MS = 1500;
const SHUFFLE_CYCLE_S = SHUFFLE_CYCLE_MS / 1000;

/**
 * Kartu-kartu shuffle. Urutan array = urutan DOM = urutan delay animasi.
 *
 * Di awal putaran, kartu index 0 ada di belakang, index 1 di tengah, dan
 * index terakhir di depan. Susunan itu sama persis dengan tumpukan kartu saat
 * diam (biru di belakang, pink di tengah, putih di depan), dan kembali ke
 * susunan yang sama setiap putaran penuh selesai. Jadi kartu PUTIH harus
 * jadi elemen terakhir supaya selalu jadi kartu yang "terpilih" di akhir.
 */
const SHUFFLE_CARDS = [
  { id: "blue", className: "bg-[#1d335c]" },
  { id: "pink", className: "bg-[#5c1d4d]" },
  { id: "white", className: "bg-primary" },
] as const;

/**
 * Hitung sisa waktu (ms) sampai putaran penuh berikutnya selesai, yaitu saat
 * kartu putih kembali ke paling atas. Minimal satu putaran penuh sejak
 * shuffle mulai, supaya animasinya tetap terlihat walau API cepat.
 */
function msUntilCycleEnd(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  const cycles = Math.max(1, Math.ceil(elapsed / SHUFFLE_CYCLE_MS));

  return cycles * SHUFFLE_CYCLE_MS - elapsed;
}

const qnaStyles = `
  @keyframes qna-shuffle {
    0%   { transform: translate3d(0, 26px, 0) scale(0.88) rotate(0deg); z-index: 1; }
    33%  { transform: translate3d(0, 13px, 0) scale(0.94) rotate(0deg); z-index: 2; }
    66%  { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); z-index: 3; }
    78%  { transform: translate3d(16%, -4%, 0) scale(1) rotate(7deg); z-index: 3; }
    88%  { transform: translate3d(16%, 6%, 0) scale(0.96) rotate(5deg); z-index: 1; }
    100% { transform: translate3d(0, 26px, 0) scale(0.88) rotate(0deg); z-index: 1; }
  }

  @keyframes qna-card-in {
    0%   { opacity: 0; transform: translateY(18px) scale(0.96) rotate(-1.5deg); }
    100% { opacity: 1; transform: none; }
  }

  .qna-shuffle-card {
    transform-origin: 50% 100%;
    will-change: transform;
    animation: qna-shuffle ${SHUFFLE_CYCLE_S}s ease-in-out infinite;
  }

  .qna-card-in {
    transform-origin: 50% 100%;
    animation: qna-card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .qna-shuffle-card,
    .qna-card-in {
      animation: none !important;
    }
  }
`;

export function QuestionCard({ session, onShufflingChange }: QuestionCardProps) {
  const t = useTranslations("qna.card");
  const tcat = useTranslations("qna.categories");
  const te = useTranslations("qna.errors");

  const [rerollError, setRerollError] = useState<QnaErrorKey | null>(null);

  // Shuffle yang dipicu klik tombol "Ganti" di device ini
  const [isShuffling, setIsShuffling] = useState(false);
  // Shuffle yang dipicu perubahan pertanyaan dari pasangan (realtime/polling)
  const [isRemoteShuffling, setIsRemoteShuffling] = useState(false);

  const [lockedHeight, setLockedHeight] = useState<number | undefined>();
  const [prevQuestion, setPrevQuestion] = useState({
    id: session.session_id,
    text: session.question_text,
  });

  const deckRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHeightRef = useRef<number>(0);
  const shuffleStartRef = useRef<number>(0);

  const { mutate: reroll, isPending: isRerolling } = useRerollQuestion();

  const alreadyAnswered = session.my_answer !== null;
  const canReroll = !alreadyAnswered && !session.partner_has_answered;
  const shuffling = isShuffling || isRerolling || isRemoteShuffling;

  /**
   * Deteksi perubahan pertanyaan yang BUKAN dari klik lokal.
   *
   * Dilakukan saat render (bukan di useEffect) supaya state shuffle sudah
   * aktif di render yang sama. Kalau lewat useEffect, pertanyaan baru sempat
   * tampil satu frame sebelum animasi mulai.
   */
  if (
    prevQuestion.id !== session.session_id ||
    prevQuestion.text !== session.question_text
  ) {
    setPrevQuestion({ id: session.session_id, text: session.question_text });

    const sameSession = prevQuestion.id === session.session_id;

    if (sameSession && !isShuffling && !isRerolling) {
      setLockedHeight(lastHeightRef.current || undefined);
      setRerollError(null);
      setIsRemoteShuffling(true);
    }
  }

  // Kabari parent setiap status shuffle berubah (untuk mengunci input jawaban)
  useEffect(() => {
    onShufflingChange?.(shuffling);
  }, [shuffling, onShufflingChange]);

  // Pastikan parent tidak "nyangkut" di status shuffle kalau card di-unmount
  useEffect(() => {
    return () => onShufflingChange?.(false);
  }, [onShufflingChange]);

  // Catat kapan animasi shuffle mulai, dipakai untuk menghitung akhir putaran.
  // Harus dideklarasikan SEBELUM effect shuffle remote di bawah.
  useEffect(() => {
    if (shuffling) shuffleStartRef.current = Date.now();
  }, [shuffling]);

  // Simpan tinggi card terakhir saat tidak shuffle (untuk mengunci layout)
  useEffect(() => {
    if (!shuffling && deckRef.current) {
      lastHeightRef.current = deckRef.current.offsetHeight;
    }
  });

  // Akhiri shuffle remote di akhir putaran penuh (kartu putih di atas).
  // Kalau pertanyaan berubah lagi saat shuffle, timer dihitung ulang tetapi
  // tetap berhenti di akhir putaran.
  useEffect(() => {
    if (!isRemoteShuffling) return;

    const t = setTimeout(
      () => setIsRemoteShuffling(false),
      msUntilCycleEnd(shuffleStartRef.current)
    );

    return () => clearTimeout(t);
  }, [isRemoteShuffling, session.question_text]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleReroll() {
    if (shuffling) return;

    setRerollError(null);

    // Kunci tinggi card supaya layout tidak loncat saat kartu dikocok
    setLockedHeight(deckRef.current?.offsetHeight);
    setIsShuffling(true);

    reroll(session.session_id, {
      onError: (err) => {
        setRerollError(getQnaErrorKey(err));
      },
      onSettled: () => {
        // Berhenti di akhir putaran, bukan di sembarang waktu
        timerRef.current = setTimeout(
          () => setIsShuffling(false),
          msUntilCycleEnd(shuffleStartRef.current)
        );
      },
    });
  }

  return (
    // Tanpa padding dan tanpa overflow clip, supaya kartu yang bergeser saat
    // shuffle tidak terpotong. flow-root menjaga margin deck tetap di dalam.
    <div className="relative flow-root w-full mb-5">
      <style>{qnaStyles}</style>

      {/* Jarak ke tepi layar dan ke elemen lain pakai margin, bukan padding */}
      <div
        ref={deckRef}
        className="relative mx-5 my-8 sm:mx-8"
        style={{
          minHeight: shuffling ? (lockedHeight ?? 300) : undefined,
        }}
      >
        {shuffling ? (
          <>
            <span role="status" className="sr-only">
              {t("shuffling")}
            </span>

            {SHUFFLE_CARDS.map((card, i) => (
              <div
                key={card.id}
                aria-hidden
                className={`qna-shuffle-card absolute inset-0 rounded-[2rem] border border-black/[0.07] shadow-[0_24px_60px_-36px_rgba(30,19,24,0.4)] ${card.className}`}
                style={{
                  animationDelay: `-${(i * SHUFFLE_CYCLE_S) / SHUFFLE_CARDS.length}s`,
                }}
              >
                <div className="absolute inset-3 rounded-[1.5rem] border border-[#c995b5]/30" />

                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-black/10" />
                  <Image src={logo} alt="logo" width={40} height={40} />
                  <span className="h-px w-8 bg-black/10" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Kartu-kartu di belakang (efek tumpukan) */}
            <div
              aria-hidden
              className="absolute inset-0 origin-bottom translate-y-[13px] scale-[0.94] rounded-[2rem] border border-black/[0.05] bg-[#5c1d4d]"
            />
            <div
              aria-hidden
              className="absolute inset-0 origin-bottom translate-y-[26px] scale-[0.88] rounded-[2rem] border border-black/[0.04] bg-[#1d335c]"
            />

            {/* Kartu utama */}
            <div
              key={session.question_text}
              className="qna-card-in relative z-10 flex min-h-[100px] flex-col rounded-[2rem] border border-black/[0.06] bg-primary px-6 py-5 shadow-[0_30px_80px_-45px_rgba(30,19,24,0.35)] sm:min-h-[340px] sm:px-9"
            >
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <p className="mt-6 max-w-xl text-sm font-medium leading-snug tracking-[-0.02em] text-secondary sm:text-[32px] md:text-[38px]">
                  {session.question_text}
                </p>
              </div>

              <div className="mx-auto flex items-center gap-2.5 pt-7">
                <span className="h-[1px] w-7 bg-black/30" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-description">
                  {tcat(`${session.category}.name`)}
                </span>
                <span className="h-[1px] w-7 bg-black/30" />
              </div>
            </div>
          </>
        )}

        {/* Tombol ganti: hanya muncul saat tidak shuffle */}
        {canReroll && !shuffling && (
          <button
            type="button"
            onClick={handleReroll}
            className="group absolute right-6 top-5 z-30 flex h-7 items-center gap-1.5 rounded-full border border-black/[0.08] bg-primary/80 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary backdrop-blur transition-colors hover:bg-primary sm:right-9"
          >
            <RefreshCw className="size-3 transition-transform duration-300 group-hover:rotate-180" />

             <span>{t("change")}</span>
          </button>
        )}
      </div>

      {rerollError && (
        <div className="mx-auto mb-4 max-w-md px-5 text-center">
           <p role="alert" className="text-xs leading-5 text-amber-600/80">
            {rerollError === "exhausted"
              ? t("rerollExhausted")
              : te(rerollError)}
          </p>
        </div>
      )}
    </div>
  );
}