'use client'

import { useState } from 'react'
import { Loader2, Plus, StickyNote, X } from 'lucide-react'

import NoteCard from './note-card'
import { useCreateNote, useNotes } from '../queries'

interface NoteBoardProps {
  relationshipId: string
}

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
    return (
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="mb-4 break-inside-avoid animate-pulse rounded-[1.5rem] border border-black/[0.05] bg-neutral-50 p-5"
            style={{
              height: `${140 + (item % 3) * 40}px`,
            }}
          >
            <div className="h-3 w-20 rounded-full bg-neutral-200" />
            <div className="mt-4 h-4 w-3/4 rounded-lg bg-neutral-200" />
            <div className="mt-2 h-3 w-full rounded-full bg-neutral-200" />
          </div>
        ))}
      </div>
    )
  }

  /* ERROR */

  if (error) {
    return (
      <div className="rounded-[2rem] border border-black/[0.06] bg-white p-8 text-center">
        <p className="text-[13px] text-neutral-400">
          {error.message}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* CREATE FORM (quick-add card) */}

      <div className="mb-4">
        {showCreate ? (
          <div className="rounded-[1.5rem] border border-black/[0.08] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <input
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
                placeholder="Judul catatan"
                autoFocus
                className="
                  w-full
                  rounded-xl
                  border
                  border-black/[0.06]
                  bg-[#f8f8f7]
                  px-3.5
                  py-2.5
                  text-[14px]
                  font-semibold
                  text-neutral-900
                  outline-none
                  focus:border-black/[0.12]
                  focus:bg-white
                "
              />

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <textarea
              value={newContent}
              onChange={(e) =>
                setNewContent(e.target.value)
              }
              placeholder="Tulis catatan, ide, atau pesan untuk pasangan..."
              rows={3}
              className="
                mt-3
                w-full
                resize-none
                rounded-xl
                border
                border-black/[0.06]
                bg-[#f8f8f7]
                px-3.5
                py-2.5
                text-[13px]
                leading-6
                text-neutral-700
                outline-none
                focus:border-black/[0.12]
                focus:bg-white
              "
            />

            <input
              value={newCategory}
              onChange={(e) =>
                setNewCategory(e.target.value)
              }
              placeholder="Kategori (misal: ide kencan, reminder)"
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-black/[0.06]
                bg-[#f8f8f7]
                px-3.5
                py-2.5
                text-[12px]
                text-neutral-600
                outline-none
                focus:border-black/[0.12]
                focus:bg-white
              "
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleCreate}
                disabled={
                  createNoteMutation.isPending ||
                  !newTitle.trim()
                }
                className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-[12px] font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {createNoteMutation.isPending ? (
                  <>
                    <Loader2
                      size={13}
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
        ) : (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-[1.5rem]
              border
              border-dashed
              border-black/[0.1]
              bg-white/50
              py-6
              text-[13px]
              font-medium
              text-neutral-400
              transition
              hover:border-black/[0.15]
              hover:bg-white
              hover:text-neutral-600
            "
          >
            <Plus size={16} strokeWidth={2} />
            Tulis catatan baru
          </button>
        )}
      </div>

      {/* EMPTY */}

      {!notes?.length && !showCreate && (
        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-50">
            <StickyNote
              size={18}
              strokeWidth={1.8}
              className="text-neutral-300"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold tracking-[-0.02em] text-neutral-800">
            Belum ada catatan
          </h3>

          <p className="mx-auto mt-2 max-w-[240px] text-[12px] leading-5 text-neutral-400">
            Mulai simpan ide, rencana, atau pesan
            kecil untuk pasanganmu.
          </p>
        </div>
      )}

      {/* MASONRY BOARD */}

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