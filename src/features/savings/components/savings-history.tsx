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
    setConfirmingId(null)
  }

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <div className="p-5 sm:p-6">

        <div className="animate-pulse space-y-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >

              <div className="size-9 shrink-0 rounded-full bg-neutral-100" />

              <div className="min-w-0 flex-1 space-y-2">

                <div className="h-3 w-24 rounded-full bg-neutral-100" />

                <div className="h-2.5 w-32 rounded-full bg-neutral-100" />

              </div>

              <div className="h-3 w-16 rounded-full bg-neutral-100" />

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
      <div className="px-6 py-12">

        <div className="flex flex-col items-center text-center">

          <div
            className="
              flex
              size-12
              items-center
              justify-center
              rounded-2xl
              bg-neutral-50
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


          <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-neutral-400">
            Contributions will appear here
            as you start saving together.
          </p>

        </div>

      </div>
    )
  }


  /* ========================================================= */
  /* LIST */
  /* ========================================================= */

  return (
    <div className="p-5 sm:p-6">

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
              className="group relative flex gap-3.5"
            >

              {/* ================================================= */}
              {/* TIMELINE */}
              {/* ================================================= */}

              <div className="relative flex w-9 shrink-0 justify-center">

                {/* Vertical line */}

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


                {/* Avatar */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white
                    bg-gradient-to-br
                    from-blue-50
                    to-pink-50
                    shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                  "
                >

                  <span className="text-[11px] font-semibold text-neutral-600">
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
                  pb-5
                  ${!isLast ? 'border-b border-black/[0.035]' : ''}
                `}
              >

                <div className="flex items-start justify-between gap-3">

                  {/* User */}

                  <div className="min-w-0">

                    <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-neutral-900">
                      {name}
                    </p>


                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-400">

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


                  {/* Amount + Delete */}
                  <div className="flex shrink-0 items-center gap-2">
                    {isConfirming ? (
                      <div
                        className="
        flex
        items-center
        gap-1
        rounded-full
        border
        border-red-100
        bg-white
        p-1
        shadow-[0_4px_14px_rgba(239,68,68,0.08)]
      "
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(saving.id)
                          }
                          disabled={isDeletingThis}
                          className="
          inline-flex
          min-h-7
          items-center
          justify-center
          gap-1.5
          rounded-full
          bg-red-500
          px-2.5
          text-[9px]
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-red-600
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:px-3
        "
                        >
                          {isDeletingThis ? (
                            <Loader2
                              size={10}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={10}
                              strokeWidth={2}
                            />
                          )}

                          <span>
                            {isDeletingThis
                              ? 'Deleting...'
                              : 'Delete'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelClick}
                          disabled={isDeletingThis}
                          className="
          inline-flex
          min-h-7
          items-center
          justify-center
          rounded-full
          px-2.5
          text-[9px]
          font-semibold
          text-neutral-500
          transition-all
          duration-200
          hover:bg-neutral-100
          hover:text-neutral-700
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:px-3
        "
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Delete contribution from ${name}`}
                        onClick={() =>
                          handleDeleteClick(saving.id)
                        }
                        className="
        group/delete
        flex
        size-7
        shrink-0
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
        sm:opacity-70
        sm:group-hover:opacity-100
      "
                      >
                        <Trash2
                          size={11}
                          strokeWidth={2}
                          className="
          transition-transform
          duration-200
          group-hover/delete:scale-105
        "
                        />
                      </button>
                    )}

                    <p
                      className="
      text-[13px]
      font-semibold
      tabular-nums
      tracking-[-0.01em]
      text-neutral-900
    "
                    >
                      + Rp{' '}
                      {Number(
                        saving.amount,
                      ).toLocaleString('id-ID')}
                    </p>
                  </div>

                </div>


                {/* Note */}

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

                    <p className="truncate text-[11px] leading-5 text-neutral-400">
                      “{saving.note}”
                    </p>

                  </div>
                )}


                {/* Together */}

                <div className="mt-2.5 flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.12em] text-pink-300">

                  <Heart
                    size={9}
                    fill="currentColor"
                    strokeWidth={0}
                  />

                  Together

                </div>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}