"use client";

import { useState } from "react";
import { Clock, Loader2, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { getQnaErrorKey } from "../errors";
import { useSubmitAnswer } from "../queries";
import type { ActiveQnaSession } from "../types";

interface AnswerInputProps {
  session: ActiveQnaSession;
  /** True saat kartu pertanyaan sedang shuffle, supaya jawaban tidak terkirim. */
  disabled?: boolean;
}

export function AnswerInput({ session, disabled = false }: AnswerInputProps) {
  const t = useTranslations("qna.answer");
  const te = useTranslations("qna.errors");

  const [answer, setAnswer] = useState(session.my_answer ?? "");
  const [prevQuestion, setPrevQuestion] = useState({
    id: session.session_id,
    text: session.question_text,
  });

  const { mutate: submitAnswer, isPending, error } = useSubmitAnswer();

  const alreadyAnswered = session.my_answer !== null;

  /**
   * Kalau pertanyaan berubah (di-reroll di device ini atau oleh pasangan),
   * draft untuk pertanyaan lama sudah tidak relevan, jadi direset.
   * Dilakukan saat render supaya tidak ada frame dengan draft lama.
   */
  if (
    prevQuestion.id !== session.session_id ||
    prevQuestion.text !== session.question_text
  ) {
    setPrevQuestion({ id: session.session_id, text: session.question_text });
    setAnswer(session.my_answer ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!answer.trim() || disabled) return;

    submitAnswer({
      sessionId: session.session_id,
      answerText: answer.trim(),
    });
  }

  if (alreadyAnswered) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-primary/65 p-6 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-description">
          {t("mine")}
        </p>

        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 tracking-[-0.01em] text-secondary sm:text-[16px]">
          {session.my_answer}
        </p>

        <div className="mt-6 flex items-center gap-3 border-t border-black/[0.07] pt-5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary ring-1 ring-black/[0.05]">
            <Clock className="size-3.5 text-description" strokeWidth={1.8} />
          </div>

          <p className="text-xs leading-5 text-description">
            {session.partner_has_answered ? t("syncing") : t("waitingPartner")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-black/[0.06] bg-primary/65 p-4 shadow-[0_20px_60px_-40px_rgba(30,19,24,0.25)] backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 py-3">
        <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.12em] text-description">
          <Lock className="size-2.5" strokeWidth={2} />
          {t("privacy")}
        </span>
      </div>

      <textarea
        id="qna-answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={t("placeholder")}
        rows={5}
        className="min-h-[150px] w-full resize-none rounded-[1.25rem] border border-black/[0.06] bg-primary/80 px-4 py-4 text-[14px] leading-6 tracking-[-0.01em] text-secondary outline-none transition-all duration-300 placeholder:text-description focus:border-black/[0.12] focus:bg-primary sm:min-h-[170px] sm:px-5 sm:py-5 sm:text-[15px]"
      />

      {session.partner_has_answered && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="size-1.5 shrink-0 rounded-full bg-[#c995b5]" />

          <p className="text-[11px] font-medium text-description">
            {t("partnerAnswered")}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-xs text-red-500/80">
          {te(getQnaErrorKey(error))}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || disabled || !answer.trim()}
        className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-800 px-6 text-sm font-semibold tracking-[-0.01em] text-white shadow-[0_18px_40px_-18px_rgba(30,19,24,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#281a21] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <span>{t("submit")}</span>
        )}
      </button>
    </form>
  );
}