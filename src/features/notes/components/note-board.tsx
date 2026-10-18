'use client'

import { useState } from 'react'
import { Loader2, Plus, StickyNote, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import NoteCard from './note-card'
import { useCreateNote, useNotes } from '../queries'
import { getNoteErrorKey } from '../errors'

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
            border-white/10
            bg-primary
            p-5
            shadow-[0_8px_28px_rgba(0,0,0,0.035)]
          `}
        >
          <div className="animate-pulse">
            {/* category + actions */}

            <div className="flex items-center justify-between">
              <div className="h-5 w-16 rounded-full bg-subprimary" />

              <div className="flex gap-1.5">
                <div className="size-6 rounded-full bg-subprimary" />
                <div className="size-6 rounded-full bg-subprimary" />
              </div>
            </div>

            {/* content */}

            <div className="mt-6 space-y-3">
              <div className="h-4 w-[72%] rounded-lg bg-subprimary" />

              <div className="space-y-2">
                <div className="h-2.5 w-full rounded-full bg-subprimary" />
                <div className="h-2.5 w-[86%] rounded-full bg-subprimary" />
                <div className="h-2.5 w-[62%] rounded-full bg-subprimary" />
              </div>
            </div>

            {/* dynamic height */}

            <div className={`${height} hidden`} />

            {/* footer */}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-3">
              <div className="h-2.5 w-16 rounded-full bg-subprimary" />
              <div className="h-2.5 w-12 rounded-full bg-subprimary" />
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
  const t = useTranslations('notes.board')

  return (
    <div className="rounded-[2rem] border border-white/10 bg-primary p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
      <div className="relative mx-auto flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-subprimary">
        <div className="absolute -right-5 -top-5 size-12 rounded-full bg-pink-500/10 blur-2xl" />

        <div className="absolute -bottom-5 -left-5 size-12 rounded-full bg-blue-500/10 blur-2xl" />

        <StickyNote
          size={19}
          strokeWidth={1.7}
          className="relative text-description"
        />
      </div>

      <h3 className="mt-5 text-[13px] font-semibold tracking-[-0.025em] text-secondary">
        {t('emptyTitle')}
      </h3>

      <p className="mx-auto mt-2 max-w-[250px] text-[11.5px] leading-5 text-description">
        {t('emptyDescription')}
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
  const t = useTranslations('notes.board')
  const te = useTranslations('notes.errors')
  const tCommon = useTranslations('common')

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
      <div className="rounded-[2rem] border border-white/10 bg-primary px-6 py-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
        <p className="text-[12px] leading-5 text-description">
          {te(getNoteErrorKey(error))}
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
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-primary shadow-[0_12px_35px_rgba(0,0,0,0.055)]">
            {/* ambient */}

            <div className="pointer-events-none absolute -right-16 -top-16 size-36 rounded-full bg-pink-500/10 blur-[70px]" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 size-36 rounded-full bg-blue-500/10 blur-[70px]" />

            <div className="relative p-5 sm:p-6">
              {/* header */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-description">
                    {t('newEyebrow')}
                  </p>

                  <h3 className="mt-1 text-[14px] font-semibold tracking-[-0.025em] text-secondary">
                    {t('newTitle')}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  aria-label={tCommon('close')}
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-subprimary
                    text-description
                    transition-all
                    hover:bg-subprimary
                    hover:text-secondary
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
                placeholder={t('titlePlaceholder')}
                autoFocus
                className="
                  mt-5
                  w-full
                  border-b
                  border-white/10
                  bg-transparent
                  pb-3
                  text-[16px]
                  font-semibold
                  tracking-[-0.025em]
                  text-secondary
                  outline-none
                  placeholder:text-description
                  focus:border-white/25
                "
              />

              {/* content */}

              <textarea
                value={newContent}
                onChange={(e) =>
                  setNewContent(e.target.value)
                }
                placeholder={t('contentPlaceholder')}
                rows={4}
                className="
                  mt-4
                  w-full
                  resize-none
                  bg-transparent
                  text-[13px]
                  leading-6
                  text-description
                  outline-none
                  placeholder:text-description
                "
              />

              {/* category */}

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-medium text-description">
                  #
                </span>

                <input
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value)
                  }
                  placeholder={t('categoryPlaceholder')}
                  className="
                    flex-1
                    bg-transparent
                    text-[11px]
                    text-description
                    outline-none
                    placeholder:text-description
                  "
                />
              </div>

              {/* footer */}

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <p className="text-[10px] text-description">
                  {t('footerNote')}
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
                    bg-subprimary
                    px-5
                    py-2.5
                    text-[11px]
                    font-semibold
                    text-secondary
                    shadow-[0_5px_16px_rgba(0,0,0,0.12)]
                    transition-all
                    hover:bg-subprimary
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
                      {t('saving')}
                    </>
                  ) : (
                    t('save')
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
              border-white/10
              bg-primary
              py-5
              text-[12px]
              font-medium
              text-description
              transition-all
              duration-300
              hover:border-white/20
              hover:bg-subprimary
              hover:text-secondary
              hover:shadow-[0_8px_25px_rgba(0,0,0,0.035)]
            "
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-subprimary transition-colors group-hover:bg-subprimary group-hover:text-secondary">
              <Plus size={13} strokeWidth={2} />
            </span>

            {t('writeNew')}
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