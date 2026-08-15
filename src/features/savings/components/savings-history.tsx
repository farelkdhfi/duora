'use client'

import { useState } from 'react'
import {
  CalendarDays,
  Heart,
  Loader2,
  Trash2,
  Wallet,
} from 'lucide-react'

import {
  useDeleteSaving,
  useGoalSavings,
} from '../queries'

interface SavingsHistoryProps {
  goalId: string
  relationshipId: string
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

export default function SavingsHistory({
  goalId,
  relationshipId,
}: SavingsHistoryProps) {
  const {
    data: savings,
    isLoading,
  } = useGoalSavings(goalId)

  const [confirmingId, setConfirmingId] =
    useState<string | null>(null)

  const deleteSavingMutation = useDeleteSaving({
    goalId,
    relationshipId,
  })

  const handleDeleteClick = (
    savingId: string,
  ) => {
    if (confirmingId !== savingId) {
      setConfirmingId(savingId)
      return
    }

    deleteSavingMutation.mutate(savingId, {
      onSettled: () => {
        setConfirmingId(null)
      },
    })
  }

  const handleCancelClick = () => {
    if (deleteSavingMutation.isPending) return

    setConfirmingId(null)
  }

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="animate-pulse space-y-5 sm:space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 sm:gap-3.5"
            >
              <div className="size-9 shrink-0 rounded-full bg-neutral-100" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-24 rounded-full bg-neutral-100" />
                <div className="h-2.5 w-32 rounded-full bg-neutral-100" />
              </div>

              <div className="h-3 w-16 shrink-0 rounded-full bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* EMPTY */
  /* ========================================================= */

  if (!savings?.length) {
    return (
      <div className="px-5 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <div
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-2xl
              bg-neutral-50
              sm:size-12
            "
          >
            <Wallet
              size={18}
              strokeWidth={1.8}
              className="text-neutral-300"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold tracking-[-0.02em] text-neutral-800">
            Nothing here yet
          </h3>

          <p className="mt-2 max-w-[220px] text-[11px] leading-5 text-neutral-400 sm:text-[12px]">
            Contributions will appear here as
            you start saving together.
          </p>
        </div>
      </div>
    )
  }

  /* ========================================================= */
  /* LIST */
  /* ========================================================= */

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <div className="space-y-1">
        {savings.map((saving, index) => {
          const name =
            saving.profile?.display_name ??
            saving.profile?.username ??
            'Unknown'

          const isLast =
            index === savings.length - 1

          const isConfirming =
            confirmingId === saving.id

          const isDeletingThis =
            deleteSavingMutation.isPending &&
            deleteSavingMutation.variables ===
            saving.id

          return (
            <div
              key={saving.id}
              className={`
                group relative
                ${!isLast ? 'pb-1' : ''}
              `}
            >
              {/* ================================================= */}
              {/* CONFIRM DELETE */}
              {/* ================================================= */}

              {isConfirming ? (
                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[1rem]
                    bg-neutral-50/50
                    px-4
                    py-4
                    sm:rounded-[1.15rem]
                    sm:px-5
                    sm:py-5
                  "
                >
                  <div className="flex flex-col gap-4">
                    {/* MESSAGE */}

                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-red-400
                          shadow-[0_2px_8px_rgba(239,68,68,0.08)]
                          sm:size-10
                        "
                      >
                        <Trash2
                          size={14}
                          strokeWidth={2}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold tracking-[-0.01em] text-neutral-800 sm:text-[13px]">
                          Delete this contribution?
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-neutral-400 sm:text-[11px]">
                          + Rp{' '}
                          {Number(
                            saving.amount,
                          ).toLocaleString('id-ID')}{' '}
                          from {name}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteClick(
                            saving.id,
                          )
                        }
                        disabled={isDeletingThis}
                        className="
                          inline-flex
                          h-9
                          flex-1
                          items-center
                          justify-center
                          gap-1.5
                          rounded-full
                          bg-red-500
                          px-4
                          text-[10px]
                          font-semibold
                          text-white
                          shadow-[0_3px_10px_rgba(239,68,68,0.12)]
                          transition-all
                          duration-200
                          hover:bg-red-600
                          active:scale-[0.98]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          sm:h-8
                          sm:flex-none
                          sm:px-4
                        "
                      >
                        {isDeletingThis && (
                          <Loader2
                            size={11}
                            className="animate-spin"
                          />
                        )}

                        {isDeletingThis
                          ? 'Deleting...'
                          : 'Delete'}
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleCancelClick
                        }
                        disabled={isDeletingThis}
                        className="
                          inline-flex
                          h-9
                          flex-1
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          px-4
                          text-[10px]
                          font-semibold
                          text-neutral-500
                          shadow-[0_2px_8px_rgba(0,0,0,0.035)]
                          transition-all
                          duration-200
                          hover:bg-neutral-100
                          hover:text-neutral-700
                          active:scale-[0.98]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          sm:h-8
                          sm:flex-none
                        "
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================================================= */
                /* NORMAL ITEM */
                /* ================================================= */

                <div className="relative flex gap-3 sm:gap-3.5">
                  {/* ================================================= */}
                  {/* TIMELINE */}
                  {/* ================================================= */}

                  <div className="relative flex w-8 shrink-0 justify-center sm:w-9">
                    {!isLast && (
                      <div
                        className="
                          absolute
                          left-1/2
                          top-9
                          h-[calc(100%+4px)]
                          w-px
                          -translate-x-1/2
                          bg-neutral-100
                        "
                      />
                    )}

                    {/* AVATAR */}

                    <div
                      className="
                        relative
                        z-10
                        flex
                        size-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white
                        bg-gradient-to-br
                        from-blue-50
                        to-pink-50
                        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                        sm:size-9
                      "
                    >
                      <span className="text-[10px] font-semibold text-neutral-600 sm:text-[11px]">
                        {name
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* CONTENT */}
                  {/* ================================================= */}

                  <div
                    className={`
                      min-w-0
                      flex-1
                      pb-4
                      sm:pb-5
                      ${!isLast
                        ? 'border-b border-black/[0.035]'
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                      {/* USER */}

                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold tracking-[-0.01em] text-neutral-900 sm:text-[13px]">
                          {name}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] text-neutral-400 sm:text-[10px]">
                          <CalendarDays
                            size={10}
                            strokeWidth={2}
                          />

                          <span>
                            {formatDate(
                              saving.created_at,
                            )}
                          </span>

                          <span className="text-neutral-200">
                            •
                          </span>

                          <span>
                            {formatTime(
                              saving.created_at,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* AMOUNT + DELETE */}

                      <div className="flex flex-col shrink-0 items-end  gap-1.5 sm:gap-2">
                       

                        {/* AMOUNT */}

                        <p
                          className="
                            text-[11px]
                            font-semibold
                            tabular-nums
                            tracking-[-0.01em]
                            text-neutral-900
                            sm:text-[13px]
                          "
                        >
                          + Rp{' '}
                          {Number(
                            saving.amount,
                          ).toLocaleString('id-ID')}
                        </p>

                         {/* DELETE BUTTON */}

                        <button
                          type="button"
                          aria-label={`Delete contribution from ${name}`}
                          onClick={() =>
                            handleDeleteClick(
                              saving.id,
                            )
                          }
                          className="
                            flex
                            size-7
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-neutral-200/80
                            bg-white
                            text-neutral-300
                            shadow-[0_2px_7px_rgba(0,0,0,0.035)]
                            transition-all
                            duration-200
                            hover:border-red-100
                            hover:bg-red-50
                            hover:text-red-500
                            active:scale-95
                            sm:size-6.5
                            sm:border-transparent
                            sm:bg-neutral-50/70
                            sm:opacity-0
                            sm:group-hover:opacity-100
                            sm:group-focus-within:opacity-100
                          "
                        >
                          <Trash2
                            size={11}
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                    </div>

                    {/* NOTE */}

                    {saving.note && (
                      <div
                        className="
                          mt-2.5
                          rounded-xl
                          bg-neutral-50/80
                          px-3
                          py-2
                        "
                      >
                        <p className="truncate text-[10px] leading-5 text-neutral-400 sm:text-[11px]">
                          “{saving.note}”
                        </p>
                      </div>
                    )}

                    {/* TOGETHER */}

                    <div className="mt-2.5 flex items-center gap-1 text-[8px] font-medium uppercase tracking-[0.12em] text-pink-300 sm:text-[9px]">
                      <Heart
                        size={9}
                        fill="currentColor"
                        strokeWidth={0}
                      />

                      Together
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}