"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Loader2, Lock, Shuffle, ArrowUpRight } from "lucide-react";
import { getCategoryInfo } from "../category-info";
import { useSubmitAnswer, useRerollQuestion } from "../queries";
import type { ActiveQnaSession } from "../types";

import logo from '@/assets/logo.png'


interface AnswerFormProps {
  session: ActiveQnaSession;
}

/** Durasi minimum animasi shuffle (ms), supaya tetap terlihat walau API cepat. */
const MIN_SHUFFLE_MS = 1400;
/** Durasi satu putaran animasi shuffle (detik). Harus sama dengan di CSS. */
const SHUFFLE_CYCLE_S = 1.5;
const SHUFFLE_CARDS = 3;

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

export function AnswerForm({ session }: AnswerFormProps) {
  const [answer, setAnswer] = useState(session.my_answer ?? "");
  const [rerollError, setRerollError] = useState<string | null>(null);

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

  const { mutate: submitAnswer, isPending, error } = useSubmitAnswer();
  const { mutate: reroll, isPending: isRerolling } = useRerollQuestion();

  const categoryInfo = getCategoryInfo(session.category);
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
      setAnswer(""); // draft untuk pertanyaan lama sudah tidak relevan
      setIsRemoteShuffling(true);
    }
  }

  // Simpan tinggi card terakhir saat tidak shuffle (untuk mengunci layout)
  useEffect(() => {
    if (!shuffling && deckRef.current) {
      lastHeightRef.current = deckRef.current.offsetHeight;
    }
  });

  // Akhiri shuffle remote setelah durasi minimum.
  // Kalau pertanyaan berubah lagi saat shuffle, timer di-reset.
  useEffect(() => {
    if (!isRemoteShuffling) return;

    const t = setTimeout(() => setIsRemoteShuffling(false), MIN_SHUFFLE_MS);

    return () => clearTimeout(t);
  }, [isRemoteShuffling, session.question_text]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!answer.trim() || shuffling) return;

    submitAnswer({
      sessionId: session.session_id,
      answerText: answer.trim(),
    });
  }

  function handleReroll() {
    if (shuffling) return;

    setRerollError(null);
    setAnswer("");

    // Kunci tinggi card supaya layout tidak loncat saat kartu dikocok
    setLockedHeight(deckRef.current?.offsetHeight);
    setIsShuffling(true);

    const startedAt = Date.now();

    reroll(session.session_id, {
      onError: (err) => {
        if (err.message.includes("QNA_EXHAUSTED")) {
          setRerollError(
            "Pertanyaan di kategori ini sudah habis. Tidak bisa reroll lagi."
          );
        } else {
          setRerollError(err.message);
        }
      },
      onSettled: () => {
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, MIN_SHUFFLE_MS - elapsed);

        timerRef.current = setTimeout(() => setIsShuffling(false), wait);
      },
    });
  }

  return (
    <div className="relative w-full overflow-x-clip">
      <style>{qnaStyles}</style>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 size-[320px] -translate-x-1/2 rounded-full blur-[110px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* ------------------------------------------------------------ */}
        {/* QUESTION CARD (deck)                                         */}
        {/* ------------------------------------------------------------ */}
        <div className="relative pb-8">
          <div
            ref={deckRef}
            className="relative"
            style={{
              minHeight: shuffling ? (lockedHeight ?? 300) : undefined,
            }}
          >
            {shuffling ? (
              <>
                <span role="status" className="sr-only">
                  Mengacak pertanyaan
                </span>

                {Array.from({ length: SHUFFLE_CARDS }).map((_, i) => (
                  <div
                    key={i}
                    aria-hidden
                    className="qna-shuffle-card absolute inset-0 rounded-[2rem] border border-black/[0.07] bg-gradient-to-b from-white to-[#f7eef3] shadow-[0_24px_60px_-36px_rgba(30,19,24,0.4)]"
                    style={{
                      animationDelay: `-${(i * SHUFFLE_CYCLE_S) / SHUFFLE_CARDS}s`,
                    }}
                  >
                    <div className="absolute inset-3 rounded-[1.5rem] border border-[#c995b5]/30" />

                    <div className="absolute inset-0 flex items-center justify-center gap-3">
                      <span className="h-px w-8 bg-black/10" />
                      <Image src={logo} alt="logo" width={40} height={40} className="" />
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
                  className="absolute inset-0 origin-bottom translate-y-[13px] scale-[0.94] rounded-[2rem] border border-black/[0.05] bg-white/70"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 origin-bottom translate-y-[26px] scale-[0.88] rounded-[2rem] border border-black/[0.04] bg-white/50"
                />

                {/* Kartu utama */}
                <div
                  key={session.question_text}
                  className="qna-card-in relative z-10 flex min-h-[300px] flex-col rounded-[2rem] border border-black/[0.06] bg-gradient-to-b from-white to-[#fcf7fa] px-6 pb-9 pt-5 shadow-[0_30px_80px_-45px_rgba(30,19,24,0.35)] sm:min-h-[340px] sm:px-9"
                >
                  <div className="flex h-7 items-center">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/35">
                      {categoryInfo.name}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="h-px w-7 bg-black/10 sm:w-10" />
                      <Image src={logo} alt="logo" width={40} height={40} className="grayscale-100" />
                      <span className="h-px w-7 bg-black/10 sm:w-10" />
                    </div>

                    <p className="mt-6 max-w-xl text-2xl font-medium leading-snug tracking-[-0.02em] text-[#171717] sm:text-[32px] md:text-[38px]">
                      {session.question_text}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Tombol ganti (selalu di atas semua kartu) */}
            {canReroll && (
              <button
                type="button"
                onClick={handleReroll}
                disabled={shuffling}
                className="group absolute right-6 top-5 z-30 flex h-7 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/80 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:right-9"
              >
                <Shuffle
                  className={`size-3 transition-transform duration-300 ${
                    shuffling ? "animate-pulse" : "group-hover:rotate-45"
                  }`}
                />

                <span>{shuffling ? "Mengacak..." : "Ganti"}</span>
              </button>
            )}
          </div>
        </div>

        {rerollError && (
          <div className="mx-auto mb-4 max-w-md text-center">
            <p role="alert" className="text-xs leading-5 text-amber-600/80">
              {rerollError}
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* ANSWER AREA                                                  */}
        {/* ------------------------------------------------------------ */}
        {alreadyAnswered ? (
          /* ANSWERED STATE */
          <div className="rounded-[2rem] border border-black/[0.06] bg-white/65 p-6 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-7">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/30">
              Jawaban kamu
            </p>

            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 tracking-[-0.01em] text-black/65 sm:text-[16px]">
              {session.my_answer}
            </p>

            <div className="mt-6 flex items-center gap-3 border-t border-black/[0.07] pt-5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/[0.05]">
                <Clock className="size-3.5 text-black/35" strokeWidth={1.8} />
              </div>

              <p className="text-xs leading-5 text-black/40">
                {session.partner_has_answered
                  ? "Jawaban kalian sedang disinkronkan..."
                  : "Menunggu pasanganmu memberikan jawabannya..."}
              </p>
            </div>
          </div>
        ) : (
          /* ANSWER FORM */
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-black/[0.06] bg-white/65 p-4 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 py-3">
              <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.12em] text-black/25">
                <Lock className="size-2.5" strokeWidth={2} />
                Privat sampai kalian berdua menjawab
              </span>
            </div>

            <textarea
              id="qna-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Tulis apa yang kamu pikirkan..."
              rows={5}
              className="min-h-[150px] w-full resize-none rounded-[1.25rem] border border-black/[0.06] bg-white/80 px-4 py-4 text-[14px] leading-6 tracking-[-0.01em] text-[#171717] outline-none transition-all duration-300 placeholder:text-black/25 focus:border-black/[0.12] focus:bg-white sm:min-h-[170px] sm:px-5 sm:py-5 sm:text-[15px]"
            />

            {session.partner_has_answered && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-[#c995b5]" />

                <p className="text-[11px] font-medium text-black/40">
                  Pasanganmu sudah menjawab. Jawab sekarang untuk melihat
                  jawabannya.
                </p>
              </div>
            )}

            {error && (
              <p className="mt-3 text-center text-xs text-red-500/80">
                {error.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || shuffling || !answer.trim()}
              className="group mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#1e1318] px-6 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Kirim jawaban</span>

                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}