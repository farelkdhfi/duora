"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { useQnaHistory, useDeleteSession, useSessionDetail } from "../queries";
import { getCategoryInfo } from "../category-info";

interface QnaHistoryProps {
  currentUserId: string;
}

const ITEMS_PER_PAGE = 10;

function HistoryReveal({
  sessionId,
  currentUserId,
}: {
  sessionId: string;
  currentUserId: string;
}) {
  const { data: session, isLoading } = useSessionDetail(sessionId);

  if (isLoading) {
    return (
      <div className="border-t border-white/10 px-5 pb-5 pt-5">
        <div className="space-y-5">
          {[0, 1].map((item) => (
            <div key={item}>
              <div className="mb-3 h-2.5 w-10 animate-pulse rounded-full bg-white/[0.08]" />

              <div className="space-y-2">
                <div
                  className="h-3 w-full animate-pulse rounded-full bg-white/[0.06]"
                  style={{
                    animationDelay: `${item * 120}ms`,
                  }}
                />
                <div
                  className="h-3 w-[82%] animate-pulse rounded-full bg-white/[0.06]"
                  style={{
                    animationDelay: `${item * 180}ms`,
                  }}
                />
              </div>

              {item === 0 && (
                <div className="mt-5 h-px w-full bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session || session.status !== "completed") {
    return null;
  }

  const myAnswer =
    session.answer_a_user_id === currentUserId
      ? session.answer_a_text
      : session.answer_b_text;

  const partnerAnswer =
    session.answer_a_user_id === currentUserId
      ? session.answer_b_text
      : session.answer_a_text;

  return (
    <div className="border-t border-white/10 px-5 pb-5 pt-5">
      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            Kamu
          </p>

          <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-white/90">
            {myAnswer}
          </p>
        </div>

        <div className="h-px w-full bg-white/[0.08]" />

        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            Pasangan
          </p>

          <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-white/90">
            {partnerAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function QnaHistoryList({ currentUserId }: QnaHistoryProps) {
  const { data: history, isLoading } = useQnaHistory();
  const { mutate: deleteSession } = useDeleteSession();

  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((history?.length ?? 0) / ITEMS_PER_PAGE);

  const paginatedHistory = useMemo(() => {
    if (!history) return [];

    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return history.slice(start, start + ITEMS_PER_PAGE);
  }, [history, currentPage]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[150px] animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
          Belum ada cerita
        </span>

        <p className="mt-4 max-w-xs text-[15px] leading-6 tracking-[-0.01em] text-white/50">
          Jawaban dari percakapan kalian akan tersimpan di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-2">
        {paginatedHistory.map((item, index) => {
          const categoryInfo = getCategoryInfo(item.category);
          const isOpen = openSessionId === item.session_id;

          const date = new Date(
            item.completed_at ?? item.created_at,
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const globalIndex =
            (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

          return (
            <div
              key={item.session_id}
              className={`group overflow-hidden rounded-[1.5rem] border bg-[#050507] shadow-[0_20px_30px_-20px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                isOpen
                  ? "border-white/20"
                  : "border-white/10 hover:-translate-y-0.5 hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenSessionId(isOpen ? null : item.session_id)
                }
                className="w-full text-left"
              >
                <div className="flex min-h-[150px] flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-medium tabular-nums tracking-[0.16em] text-white/30">
                        {String(globalIndex).padStart(2, "0")}
                      </span>

                      <span className="h-0.5 w-0.5 rounded-full bg-white/25" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-pink-200">
                        {categoryInfo.name}
                      </span>
                    </div>

                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-white bg-white text-neutral-900"
                          : "border-white/10 bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
                      }`}
                    >
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.7}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="line-clamp-2 text-[14px] font-medium leading-6 tracking-[-0.015em] text-white">
                      {item.question_text}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-white/35">
                      {date}
                    </p>
                  </div>
                </div>
              </button>

              {isOpen && (
                <>
                  <HistoryReveal
                    sessionId={item.session_id}
                    currentUserId={currentUserId}
                  />

                  <div className="flex justify-end px-5 pb-5">
                    <button
                      type="button"
                      aria-label="Hapus sesi"
                      onClick={() => {
                        deleteSession(item.session_id);
                        setOpenSessionId(null);
                      }}
                      className="flex items-center gap-2 rounded-full px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/35 transition-colors hover:text-red-300"
                    >
                      <Trash2 size={12} strokeWidth={1.6} />
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((page) => Math.max(1, page - 1));
              setOpenSessionId(null);
            }}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={15} strokeWidth={1.7} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    setCurrentPage(page);
                    setOpenSessionId(null);
                  }}
                  className={`flex size-9 items-center justify-center rounded-full text-[11px] font-medium tabular-nums transition-all ${
                    isActive
                      ? "bg-white text-neutral-900"
                      : "text-white/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((page) => Math.min(totalPages, page + 1));
              setOpenSessionId(null);
            }}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={15} strokeWidth={1.7} />
          </button>
        </div>
      )}
    </div>
  );
}