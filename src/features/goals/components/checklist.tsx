'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Check,
  ListChecks,
  Plus,
  Trash2,
} from 'lucide-react'

import {
  useChecklist,
  useCreateChecklistItem,
  useDeleteChecklistItem,
  useToggleChecklistItem,
} from '../checklist-queries'

interface ChecklistProps {
  goalId: string
}

export default function Checklist({
  goalId,
}: ChecklistProps) {
  const t = useTranslations('goals.checklist')
  const tCommon = useTranslations('common')
  const [title, setTitle] = useState('')
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

  const {
    data: items,
    isLoading,
  } = useChecklist(goalId)

  const createMutation = useCreateChecklistItem()
  const toggleMutation = useToggleChecklistItem()
  const deleteMutation = useDeleteChecklistItem()

  function handleCreate() {
    const trimmed = title.trim()

    if (!trimmed) return

    createMutation.mutate({
      goalId,
      title: trimmed,
    })

    setTitle('')
  }

  function handleDeleteClick(itemId: string) {
    if (confirmingDeleteId !== itemId) {
      setConfirmingDeleteId(itemId)
      return
    }

    deleteMutation.mutate(itemId, {
      onSettled: () => {
        setConfirmingDeleteId(null)
      },
    })
  }

  function handleCancelDelete() {
    setConfirmingDeleteId(null)
  }

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-primary sm:rounded-[2rem]">

        <div className="animate-pulse p-4 xs:p-5 sm:p-6 lg:p-7">

          {/* Header */}

          <div className="flex items-center justify-between gap-3 sm:gap-4">

            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

              <div className="size-9 shrink-0 rounded-[12px] bg-subprimary sm:size-10 sm:rounded-[14px]" />

              <div className="min-w-0 space-y-2">
                <div className="h-2 w-16 rounded-full bg-subprimary" />
                <div className="h-3.5 w-28 rounded-full bg-subprimary sm:h-4 sm:w-32" />
              </div>

            </div>

            <div className="h-7 w-11 shrink-0 rounded-full bg-subprimary" />

          </div>

          {/* Progress */}

          <div className="mt-7 h-1.5 rounded-full bg-subprimary sm:mt-8" />

          {/* Items */}

          <div className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 sm:gap-3"
              >
                <div className="size-5 shrink-0 rounded-md bg-subprimary" />

                <div className="h-3 w-32 rounded-full bg-subprimary sm:w-40" />
              </div>
            ))}

          </div>

          {/* Add */}

          <div className="mt-6 h-11 rounded-[12px] bg-subprimary sm:mt-7 sm:h-12 sm:rounded-[14px]" />

        </div>

      </section>
    )
  }

  /* ========================================================= */
  /* CALCULATION */
  /* ========================================================= */

  const completedCount =
    items?.filter(
      (item) => item.is_completed,
    ).length ?? 0

  const totalCount =
    items?.length ?? 0

  const progress =
    totalCount > 0
      ? Math.round(
        (completedCount / totalCount) * 100,
      )
      : 0

  const isCompleted =
    totalCount > 0 &&
    completedCount === totalCount

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-primary sm:rounded-[2rem]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="p-4 xs:p-5 sm:p-6 lg:p-7">

        <div className="flex items-start justify-between gap-3 sm:gap-4">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-subprimary text-secondary sm:size-10 sm:rounded-[14px]">
              <ListChecks
                size={15}
                strokeWidth={2}
                className="sm:size-4"
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-description sm:text-[10px] sm:tracking-[0.16em]">
                {t('eyebrow')}
              </p>

              <h2 className="mt-1 truncate text-[14px] font-semibold tracking-[-0.025em] text-secondary sm:text-[15px]">
                	{t('title')}
              </h2>

            </div>

          </div>

          {/* COUNT */}

          {totalCount > 0 && (
            <div className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-semibold tabular-nums sm:px-3 sm:text-[11px] ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-subprimary text-description'}`}>
              {completedCount}/{totalCount}
            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* PROGRESS */}
        {/* ================================================= */}

        {totalCount > 0 && (
          <div className="mt-7 sm:mt-8">

            <div className="flex items-center justify-between gap-3">

              <span className="min-w-0 truncate text-[9px] text-description sm:text-[10px]">
                {isCompleted ? t('allComplete') : t('percentCompleted', { progress })}
              </span>

              {isCompleted && (
                <span className="flex shrink-0 items-center gap-1 text-[9px] font-medium text-emerald-500 sm:text-[10px]">
                  <Check
                    size={11}
                    strokeWidth={2.8}
                  />
                  	{t('allDone')}
                </span>
              )}

            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-subprimary">

              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-secondary'}`}
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>
        )}

      </div>

      {/* ===================================================== */}
      {/* ITEMS */}
      {/* ===================================================== */}

      <div className="border-t border-white/[0.06]">

        {items?.length ? (

          <div>

            {items.map((item) => (

              <div
                key={item.id}
                className="group flex items-center gap-2.5 border-b border-white/[0.05] px-3.5 py-3 transition-colors hover:bg-subprimary/60 sm:gap-3 sm:px-5 sm:py-3.5 lg:px-6"
              >

                {/* CHECK */}

                <button
                  type="button"
                  aria-label={
                    item.is_completed
                      ? t('markIncomplete')
                      : t('markComplete')
                  }
                  onClick={() =>
                    toggleMutation.mutate({
                      id: item.id,
                      isCompleted:
                        !item.is_completed,
                    })
                  }
                  disabled={
                    toggleMutation.isPending
                  }
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${item.is_completed ? 'border-secondary bg-secondary text-primary' : 'border-white/[0.12] bg-primary hover:border-white/30'}`}
                >

                  {item.is_completed && (
                    <Check
                      size={12}
                      strokeWidth={3}
                    />
                  )}

                </button>

                {/* TITLE */}

                <span className={`min-w-0 flex-1 truncate text-[12px] leading-5 transition-all duration-200 sm:text-[13px] ${item.is_completed ? 'text-description line-through' : 'text-secondary'}`}>
                  {item.title}
                </span>

                {/* DELETE */}

                {confirmingDeleteId === item.id ? (
                  <div className="flex shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-primary p-1 shadow-[0_3px_12px_rgba(239,68,68,0.08)]">
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteClick(item.id)
                      }
                      disabled={deleteMutation.isPending}
                      className="inline-flex min-h-7 items-center justify-center gap-1 rounded-full bg-red-500 px-2.5 text-[9px] font-semibold text-secondary transition-all duration-200 hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-7.5 sm:px-3"
                    >
                      {deleteMutation.isPending ? (
                        <span className="size-2.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Trash2
                          size={10}
                          strokeWidth={2}
                        />
                      )}

                      <span>
                        {deleteMutation.isPending ? t('deleting') : tCommon('delete')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      disabled={deleteMutation.isPending}
                      className="inline-flex min-h-7 items-center justify-center rounded-full px-2.5 text-[9px] font-semibold text-description transition-all duration-200 hover:bg-subprimary hover:text-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-7.5 sm:px-3"
                    >
                      {tCommon('cancel')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={t('deleteAria', { title: item.title })}
                    onClick={() =>
                      handleDeleteClick(item.id)
                    }
                    disabled={deleteMutation.isPending}
                    className="group/delete flex size-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-subprimary text-description shadow-[0_2px_7px_rgba(0,0,0,0.035)] transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500 active:scale-95 sm:size-6.5 sm:border-transparent sm:bg-subprimary sm:opacity-70 sm:group-hover:opacity-100 sm:focus:opacity-100"
                  >
                    <Trash2
                      size={11}
                      strokeWidth={2}
                      className="transition-transform duration-200 group-hover/delete:scale-105"
                    />
                  </button>
                )}

              </div>

            ))}

          </div>

        ) : (

          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <div className="px-4 py-9 text-center xs:px-5 sm:px-6 sm:py-10 lg:px-7">

            <h3 className="mt-3 text-[12px] font-semibold text-secondary sm:text-[13px]">
              {t('emptyTitle')}
            </h3>

            <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-description sm:text-[11px]">
              {t('emptyDescription')}
            </p>

          </div>

        )}

      </div>

      {/* ===================================================== */}
      {/* ADD ITEM */}
      {/* ===================================================== */}

      <div className="border-t border-white/[0.06] bg-subprimary/50 p-3.5 xs:p-4 sm:px-5 sm:py-4 lg:px-6">

        <div className="flex items-center gap-2">

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleCreate()
              }
            }}
            placeholder={t('placeholder')}
            className="h-11 min-w-0 flex-1 rounded-[12px] border border-white/[0.06] bg-primary px-3.5 text-[12px] text-secondary outline-none transition placeholder:text-description focus:border-white/20 focus:ring-4 focus:ring-white/[0.05] sm:h-12 sm:rounded-[14px] sm:px-4"
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              createMutation.isPending ||
              !title.trim()
            }
            className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-subprimary text-secondary transition-all hover:bg-subprimary/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 sm:size-12 sm:rounded-[14px]"
            aria-label={t('addAria')}
          >

            <Plus
              size={16}
              strokeWidth={2.5}
            />

          </button>

        </div>

        <p className="mt-2 px-1 text-[8px] text-description sm:text-[9px]">
          {t('hint')}
        </p>

      </div>

    </section>
  )
}