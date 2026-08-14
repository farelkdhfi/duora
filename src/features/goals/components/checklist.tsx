'use client'

import { useState } from 'react'
import {
  Check,
  ListChecks,
  Plus,
  Sparkles,
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
  const [title, setTitle] = useState('')

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

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
        <div className="animate-pulse p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="size-9 rounded-xl bg-neutral-100" />

              <div className="space-y-2">
                <div className="h-2 w-16 rounded-full bg-neutral-100" />
                <div className="h-4 w-28 rounded-full bg-neutral-100" />
              </div>

            </div>

            <div className="h-6 w-12 rounded-full bg-neutral-100" />

          </div>

          <div className="mt-6 h-1.5 rounded-full bg-neutral-100" />

          <div className="mt-6 space-y-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3"
              >
                <div className="size-5 rounded-md bg-neutral-100" />
                <div className="h-3 w-40 rounded-full bg-neutral-100" />
              </div>
            ))}

          </div>

          <div className="mt-7 h-10 rounded-xl bg-neutral-100" />

        </div>
      </section>
    )
  }

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
    <section className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="p-5 sm:p-6">

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                flex size-9 shrink-0
                items-center justify-center
                rounded-xl
                bg-neutral-900
                text-white
              "
            >
              <ListChecks
                size={16}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                Together
              </p>

              <h2 className="mt-1 text-[15px] font-semibold tracking-[-0.025em] text-neutral-900">
                Checklist
              </h2>

            </div>

          </div>


          {/* COUNT */}

          {totalCount > 0 && (
            <div
              className={`
                shrink-0
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                tabular-nums
                ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-neutral-100 text-neutral-500'
                }
              `}
            >
              {completedCount}/{totalCount}
            </div>
          )}

        </div>


        {/* ================================================= */}
        {/* PROGRESS */}
        {/* ================================================= */}

        {totalCount > 0 && (
          <div className="mt-6">

            <div className="flex items-center justify-between">

              <span className="text-[10px] text-neutral-400">
                {isCompleted
                  ? 'Everything is complete'
                  : `${progress}% completed`}
              </span>

              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                  <Check
                    size={11}
                    strokeWidth={2.8}
                  />
                  All done
                </span>
              )}

            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">

              <div
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-500
                  ease-out
                  ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-neutral-900'
                  }
                `}
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

      <div className="border-t border-black/[0.05]">

        {items?.length ? (

          <div>

            {items.map((item) => (

              <div
                key={item.id}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  border-b
                  border-black/[0.04]
                  px-5
                  py-3.5
                  transition-colors
                  hover:bg-neutral-50/60
                  sm:px-6
                "
              >

                {/* CHECK */}

                <button
                  type="button"
                  aria-label={
                    item.is_completed
                      ? 'Mark as incomplete'
                      : 'Mark as completed'
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
                  className={`
                    flex
                    size-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border
                    transition-all
                    duration-200
                    ${
                      item.is_completed
                        ? `
                          border-neutral-900
                          bg-neutral-900
                          text-white
                        `
                        : `
                          border-neutral-200
                          bg-white
                          hover:border-neutral-400
                        `
                    }
                  `}
                >

                  {item.is_completed && (
                    <Check
                      size={12}
                      strokeWidth={3}
                    />
                  )}

                </button>


                {/* TITLE */}

                <span
                  className={`
                    min-w-0
                    flex-1
                    text-[13px]
                    leading-5
                    transition-all
                    duration-200
                    ${
                      item.is_completed
                        ? 'text-neutral-300 line-through'
                        : 'text-neutral-700'
                    }
                  `}
                >
                  {item.title}
                </span>


                {/* DELETE */}

                <button
                  type="button"
                  aria-label="Delete checklist item"
                  onClick={() =>
                    deleteMutation.mutate(item.id)
                  }
                  disabled={
                    deleteMutation.isPending
                  }
                  className="
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-neutral-200
                    opacity-0
                    transition-all
                    duration-200
                    group-hover:opacity-100
                    hover:bg-rose-50
                    hover:text-rose-400
                    focus:opacity-100
                  "
                >
                  <Trash2
                    size={13}
                    strokeWidth={2}
                  />
                </button>

              </div>

            ))}

          </div>

        ) : (

          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <div className="px-5 py-10 text-center sm:px-6">

            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-neutral-50">

              <Sparkles
                size={16}
                strokeWidth={1.8}
                className="text-neutral-300"
              />

            </div>

            <h3 className="mt-3 text-[13px] font-semibold text-neutral-600">
              Nothing to check off yet
            </h3>

            <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-neutral-400">
              Add a small step and work toward
              this goal together.
            </p>

          </div>

        )}

      </div>


      {/* ===================================================== */}
      {/* ADD ITEM */}
      {/* ===================================================== */}

      <div className="border-t border-black/[0.05] bg-neutral-50/50 p-4 sm:px-5">

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
            placeholder="Add a small step..."
            className="
              h-10
              min-w-0
              flex-1
              rounded-xl
              border
              border-black/[0.06]
              bg-white
              px-3.5
              text-[12px]
              text-neutral-700
              outline-none
              transition
              placeholder:text-neutral-300
              focus:border-neutral-300
              focus:ring-4
              focus:ring-black/[0.025]
            "
          />

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              createMutation.isPending ||
              !title.trim()
            }
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-neutral-900
              text-white
              transition-all
              hover:bg-neutral-800
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-20
            "
            aria-label="Add checklist item"
          >

            <Plus
              size={16}
              strokeWidth={2.5}
            />

          </button>

        </div>

        <p className="mt-2 px-1 text-[9px] text-neutral-300">
          Press Enter to add
        </p>

      </div>

    </section>
  )
}