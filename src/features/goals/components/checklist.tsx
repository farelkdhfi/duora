'use client'

import { useState } from 'react'
import {
  Check,
  Plus,
  Trash2,
  ListChecks,
  Sparkles,
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

  const createMutation =
    useCreateChecklistItem()

  const toggleMutation =
    useToggleChecklistItem()

  const deleteMutation =
    useDeleteChecklistItem()


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
      <section className="rounded-[1.75rem] border border-black/[0.05] bg-white p-6">
        <div className="animate-pulse">

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[14px] bg-neutral-100" />

            <div className="space-y-2">
              <div className="h-2.5 w-20 rounded-full bg-neutral-100" />
              <div className="h-4 w-32 rounded-full bg-neutral-100" />
            </div>
          </div>

          <div className="mt-7 space-y-3">
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


  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white shadow-[0_15px_40px_-25px_rgba(0,0,0,0.12)]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="relative border-b border-black/[0.05] px-6 py-5">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-50 to-pink-50">

              <ListChecks
                size={18}
                strokeWidth={2}
                className="text-blue-500"
              />

            </div>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
                Together
              </p>

              <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-neutral-800">
                Checklist
              </h2>

            </div>

          </div>


          {totalCount > 0 && (
            <div className="flex items-center gap-2">

              <span className="text-[10px] font-semibold text-neutral-400">
                {completedCount}/{totalCount}
              </span>

              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-pink-400 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>
          )}

        </div>


        <p className="mt-4 text-[12px] leading-relaxed text-neutral-400">
          Small steps you can complete together.
        </p>

      </div>


      {/* ===================================================== */}
      {/* CHECKLIST */}
      {/* ===================================================== */}

      <div className="px-6">

        {items?.length ? (
          <div>

            {items.map(
              (item, index) => {

                const isLast =
                  index ===
                  items.length - 1

                return (
                  <div
                    key={item.id}
                    className={[
                      'group flex items-center gap-3.5 py-4',
                      !isLast
                        ? 'border-b border-black/[0.04]'
                        : '',
                    ].join(' ')}
                  >

                    {/* CHECK BUTTON */}

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
                      className={[
                        'relative flex size-5 shrink-0 items-center justify-center rounded-[7px] border transition-all duration-200',
                        item.is_completed
                          ? 'border-blue-500 bg-blue-500 text-white shadow-[0_3px_10px_-4px_rgba(0,122,255,0.7)]'
                          : 'border-neutral-200 bg-white hover:border-blue-300 hover:bg-blue-50/50',
                      ].join(' ')}
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
                      className={[
                        'min-w-0 flex-1 text-[13px] transition-all duration-200',
                        item.is_completed
                          ? 'text-neutral-300 line-through'
                          : 'text-neutral-700',
                      ].join(' ')}
                    >
                      {item.title}
                    </span>


                    {/* DELETE */}

                    <button
                      type="button"
                      aria-label="Delete checklist item"
                      onClick={() =>
                        deleteMutation.mutate(
                          item.id,
                        )
                      }
                      disabled={
                        deleteMutation.isPending
                      }
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-200 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2
                        size={14}
                        strokeWidth={2}
                      />
                    </button>

                  </div>
                )
              },
            )}

          </div>
        ) : (
          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */

          <div className="py-9 text-center">

            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-neutral-50">

              <Sparkles
                size={18}
                strokeWidth={1.8}
                className="text-neutral-300"
              />

            </div>

            <h3 className="mt-4 text-[13px] font-semibold text-neutral-600">
              Nothing here yet
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-neutral-400">
              Add a small step and work on it
              together.
            </p>

          </div>
        )}

      </div>


      {/* ===================================================== */}
      {/* ADD ITEM */}
      {/* ===================================================== */}

      <div className="border-t border-black/[0.05] bg-neutral-[2%] px-6 py-4">

        <div className="flex items-center gap-2">

          <div className="relative flex-1">

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter'
                ) {
                  event.preventDefault()
                  handleCreate()
                }
              }}
              placeholder="Add a checklist item..."
              className="h-10 w-full rounded-xl border border-black/[0.06] bg-white px-3.5 text-[12px] text-neutral-700 outline-none transition placeholder:text-neutral-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.06]"
            />

          </div>


          <button
            type="button"
            onClick={handleCreate}
            disabled={
              createMutation.isPending ||
              !title.trim()
            }
            className="flex h-10 items-center gap-1.5 rounded-xl bg-neutral-900 px-4 text-[11px] font-semibold text-white shadow-[0_5px_14px_-6px_rgba(0,0,0,0.4)] transition-all hover:bg-neutral-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
          >

            <Plus
              size={14}
              strokeWidth={2.5}
            />

            Add

          </button>

        </div>

      </div>

    </section>
  )
}