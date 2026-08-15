'use client'

import { useState } from 'react'
import { Loader2, Plus, StickyNote, X } from 'lucide-react'

import NoteCard from './note-card'
import { useCreateNote, useNotes } from '../queries'

interface NoteBoardProps {
  relationshipId: string
}

/* -------------------------------------------------------------------------- */
/* SKELETON                                                                   */
/* -------------------------------------------------------------------------- */

function NoteBoardSkeleton() {
  const heights = [
    'h-[190px]',
    'h-[250px]',
    'h-[215px]',
    'h-[175px]',
    'h-[230px]',
    'h-[195px]',
  ]

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {heights.map((height, index) => (
        <div
          key={index}
          className={`
            mb-4
            break-inside-avoid
            overflow-hidden
            rounded-[1.75rem]
            border
            border-black/[0.045]
            bg-white
            p-5
            shadow-[0_8px_28px_rgba(0,0,0,0.035)]
          `}
        >
          <div className="animate-pulse">
            {/* category + actions */}

            <div className="flex items-center justify-between">
              <div className="h-5 w-16 rounded-full bg-neutral-100" />

              <div className="flex gap-1.5">
                <div className="size-6 rounded-full bg-neutral-100" />
                <div className="size-6 rounded-full bg-neutral-100" />
              </div>
            </div>

            {/* content */}

            <div className="mt-6 space-y-3">
              <div className="h-4 w-[72%] rounded-lg bg-neutral-100" />

              <div className="space-y-2">
                <div className="h-2.5 w-full rounded-full bg-neutral-100" />
                <div className="h-2.5 w-[86%] rounded-full bg-neutral-100" />
                <div className="h-2.5 w-[62%] rounded-full bg-neutral-100" />
              </div>
            </div>

            {/* dynamic height */}

            <div className={`${height} hidden`} />

            {/* footer */}

            <div className="mt-8 flex items-center justify-between border-t border-black/[0.035] pt-3">
              <div className="h-2.5 w-16 rounded-full bg-neutral-100" />
              <div className="h-2.5 w-12 rounded-full bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function NoteEmptyState() {
  return (
    <div className="rounded-[2rem] border border-black/[0.045] bg-white p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
      <div className="relative mx-auto flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-black/[0.04] bg-neutral-50">
        <div className="absolute -right-5 -top-5 size-12 rounded-full bg-pink-100 blur-2xl" />

        <div className="absolute -bottom-5 -left-5 size-12 rounded-full bg-blue-100 blur-2xl" />

        <StickyNote
          size={19}
          strokeWidth={1.7}
          className="relative text-neutral-400"
        />
      </div>

      <h3 className="mt-5 text-[13px] font-semibold tracking-[-0.025em] text-neutral-800">
        Belum ada catatan
      </h3>

      <p className="mx-auto mt-2 max-w-[250px] text-[11.5px] leading-5 text-neutral-400">
        Simpan ide, rencana, reminder, atau pesan
        kecil untuk pasanganmu.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function NoteBoard({
  relationshipId,
}: NoteBoardProps) {
  const {
    data: notes,
    isLoading,
    error,
  } = useNotes(relationshipId)

  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('')

  const createNoteMutation = useCreateNote(
    relationshipId,
  )

  const handleCreate = () => {
    if (!newTitle.trim()) return

    createNoteMutation.mutate(
      {
        relationshipId,
        values: {
          title: newTitle.trim(),
          content: newContent.trim() || undefined,
          category: newCategory.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setNewTitle('')
          setNewContent('')
          setNewCategory('')
          setShowCreate(false)
        },
      },
    )
  }

  /* LOADING */

  if (isLoading) {
    return <NoteBoardSkeleton />
  }

  /* ERROR */

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/[0.045] bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
        <p className="text-[12px] leading-5 text-neutral-400">
          {error.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* CREATE                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-5">
        {showCreate ? (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.055] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.055)]">
            {/* ambient */}

            <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-pink-100/60 blur-[70px]" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full bg-blue-100/50 blur-[70px]" />

            <div className="relative p-5 sm:p-6">
              {/* header */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                    New note
                  </p>

                  <h3 className="mt-1 text-[14px] font-semibold tracking-[-0.025em] text-neutral-900">
                    Tulis sesuatu
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.045]
                    bg-neutral-50
                    text-neutral-400
                    transition-all
                    hover:bg-neutral-900
                    hover:text-white
                  "
                >
                  <X size={14} />
                </button>
              </div>

              {/* title */}

              <input
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
                placeholder="Judul catatan"
                autoFocus
                className="
                  mt-5
                  w-full
                  border-b
                  border-black/[0.07]
                  bg-transparent
                  pb-3
                  text-[16px]
                  font-semibold
                  tracking-[-0.025em]
                  text-neutral-900
                  outline-none
                  placeholder:text-neutral-300
                  focus:border-black/[0.18]
                "
              />

              {/* content */}

              <textarea
                value={newContent}
                onChange={(e) =>
                  setNewContent(e.target.value)
                }
                placeholder="Tulis catatan, ide, atau pesan untuk pasangan..."
                rows={4}
                className="
                  mt-4
                  w-full
                  resize-none
                  bg-transparent
                  text-[13px]
                  leading-6
                  text-neutral-600
                  outline-none
                  placeholder:text-neutral-300
                "
              />

              {/* category */}

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-medium text-neutral-300">
                  #
                </span>

                <input
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value)
                  }
                  placeholder="kategori"
                  className="
                    flex-1
                    bg-transparent
                    text-[11px]
                    text-neutral-500
                    outline-none
                    placeholder:text-neutral-300
                  "
                />
              </div>

              {/* footer */}

              <div className="mt-5 flex items-center justify-between border-t border-black/[0.04] pt-4">
                <p className="text-[10px] text-neutral-300">
                  Catatan akan tersimpan untuk kalian berdua.
                </p>

                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={
                    createNoteMutation.isPending ||
                    !newTitle.trim()
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-neutral-900
                    px-5
                    py-2.5
                    text-[11px]
                    font-semibold
                    text-white
                    shadow-[0_5px_16px_rgba(0,0,0,0.12)]
                    transition-all
                    hover:bg-black
                    active:scale-[0.98]
                    disabled:opacity-40
                  "
                >
                  {createNoteMutation.isPending ? (
                    <>
                      <Loader2
                        size={12}
                        className="animate-spin"
                      />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan catatan'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="
              group
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-[1.5rem]
              border
              border-dashed
              border-black/[0.075]
              bg-white/70
              py-5
              text-[12px]
              font-medium
              text-neutral-400
              transition-all
              duration-300
              hover:border-black/[0.13]
              hover:bg-white
              hover:text-neutral-700
              hover:shadow-[0_8px_25px_rgba(0,0,0,0.035)]
            "
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-neutral-100 transition-colors group-hover:bg-neutral-900 group-hover:text-white">
              <Plus size={13} strokeWidth={2} />
            </span>

            Tulis catatan baru
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* EMPTY                                                               */}
      {/* ------------------------------------------------------------------ */}

      {!notes?.length && !showCreate && (
        <NoteEmptyState />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MASONRY                                                             */}
      {/* ------------------------------------------------------------------ */}

      {Boolean(notes?.length) && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {notes!.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              relationshipId={relationshipId}
            />
          ))}
        </div>
      )}
    </div>
  )
}