'use client'

import { useState } from 'react'
import {
  CheckSquare,
  Loader2,
  Pin,
  Plus,
  Square,
  Star,
  Trash2,
  X,
} from 'lucide-react'

import type { NoteWithDetails } from '../types'
import { getNoteColor } from '../utils'

import {
  useAddChecklistItem,
  useDeleteChecklistItem,
  useDeleteNote,
  useToggleChecklistItem,
  useToggleNoteFavorite,
  useToggleNotePin,
  useUpdateNote,
} from '../queries'

interface NoteCardProps {
  note: NoteWithDetails
  relationshipId: string
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

export default function NoteCard({
  note,
  relationshipId,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(
    note.content ?? '',
  )
  const [category, setCategory] = useState(
    note.category ?? '',
  )
  const [newChecklistText, setNewChecklistText] =
    useState('')

  const updateNoteMutation = useUpdateNote(
    relationshipId,
  )

  const deleteNoteMutation = useDeleteNote(
    relationshipId,
  )

  const togglePinMutation = useToggleNotePin(
    relationshipId,
  )

  const toggleFavoriteMutation =
    useToggleNoteFavorite(relationshipId)

  const toggleChecklistMutation =
    useToggleChecklistItem(relationshipId)

  const addChecklistMutation =
    useAddChecklistItem(relationshipId)

  const deleteChecklistMutation =
    useDeleteChecklistItem(relationshipId)

  const color = getNoteColor(note.category)

  const editorName =
    note.editor?.display_name ??
    note.editor?.username ??
    note.creator?.display_name ??
    note.creator?.username ??
    'Seseorang'

  const completedCount =
    note.checklist_items.filter(
      (item) => item.is_completed,
    ).length

  const handleOpenEdit = () => {
    setTitle(note.title)
    setContent(note.content ?? '')
    setCategory(note.category ?? '')
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!title.trim()) return

    updateNoteMutation.mutate(
      {
        noteId: note.id,
        values: {
          title: title.trim(),
          content: content.trim() || undefined,
          category: category.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      },
    )
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsConfirmingDelete(false)
  }

  const handleDelete = (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteNoteMutation.mutate(note.id)
  }

  const handleTogglePin = (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()

    togglePinMutation.mutate({
      noteId: note.id,
      isPinned: !note.is_pinned,
    })
  }

  const handleToggleFavorite = (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()

    toggleFavoriteMutation.mutate({
      noteId: note.id,
      isFavorite: !note.is_favorite,
    })
  }

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return

    addChecklistMutation.mutate(
      {
        noteId: note.id,
        content: newChecklistText.trim(),
        position: note.checklist_items.length,
      },
      {
        onSuccess: () => {
          setNewChecklistText('')
        },
      },
    )
  }

  return (
    <article
      className={`
        group
        relative
        mb-4
        break-inside-avoid
        overflow-hidden
        rounded-[1.75rem]
        border
        ${color.border}
        ${color.bg}
        shadow-[0_8px_28px_rgba(0,0,0,0.035)]
        transition-all
        duration-300
        ${!isEditing
          ? 'hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(0,0,0,0.075)]'
          : ''
        }
      `}
    >
      {/* AMBIENT */}

      <div className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-white/50 blur-[45px]" />

      <div className="relative p-5">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {note.category ? (
              <span
                className={`
                  inline-flex
                  max-w-[150px]
                  truncate
                  items-center
                  rounded-full
                  bg-white/60
                  px-2.5
                  py-1
                  text-[8.5px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  ${color.text}
                `}
              >
                {note.category}
              </span>
            ) : (
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-300">
                Note
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`
                flex
                size-7
                items-center
                justify-center
                rounded-full
                transition-all
                hover:bg-white/70
                ${note.is_favorite
                  ? 'text-amber-500'
                  : 'text-neutral-300'
                }
              `}
            >
              <Star
                size={13}
                fill={
                  note.is_favorite
                    ? 'currentColor'
                    : 'none'
                }
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={handleTogglePin}
              className={`
                flex
                size-7
                items-center
                justify-center
                rounded-full
                transition-all
                hover:bg-white/70
                ${note.is_pinned
                  ? 'text-neutral-900'
                  : 'text-neutral-300'
                }
              `}
            >
              <Pin
                size={13}
                fill={
                  note.is_pinned
                    ? 'currentColor'
                    : 'none'
                }
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* EDIT MODE                                                        */}
        {/* ---------------------------------------------------------------- */}

        {isEditing ? (
          <div className="mt-5 space-y-3">
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Note title"
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-black/[0.055]
                bg-white/80
                px-3.5
                py-2.5
                text-[14px]
                font-semibold
                tracking-[-0.02em]
                text-neutral-900
                outline-none
                placeholder:text-neutral-300
                focus:border-black/[0.12]
                focus:bg-white
              "
            />

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write a note..."
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-black/[0.055]
                bg-white/80
                px-3.5
                py-2.5
                text-[12.5px]
                leading-6
                text-neutral-700
                outline-none
                placeholder:text-neutral-300
                focus:border-black/[0.12]
                focus:bg-white
              "
            />

            <input
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Category (optional)"
              className="
                w-full
                rounded-xl
                border
                border-black/[0.055]
                bg-white/80
                px-3.5
                py-2.5
                text-[11px]
                text-neutral-600
                outline-none
                placeholder:text-neutral-300
                focus:border-black/[0.12]
                focus:bg-white
              "
            />

            {/* CHECKLIST */}

            {note.checklist_items.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {note.checklist_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-xl border border-black/[0.035] bg-white/55 px-2.5 py-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleChecklistMutation.mutate({
                          itemId: item.id,
                          isCompleted:
                            !item.is_completed,
                        })
                      }
                      className="shrink-0"
                    >
                      {item.is_completed ? (
                        <CheckSquare
                          size={14}
                          className="text-emerald-500"
                        />
                      ) : (
                        <Square
                          size={14}
                          className="text-neutral-300"
                        />
                      )}
                    </button>

                    <span
                      className={`
                        min-w-0
                        flex-1
                        truncate
                        text-[11px]
                        ${item.is_completed
                          ? 'text-neutral-400 line-through'
                          : 'text-neutral-600'
                        }
                      `}
                    >
                      {item.content}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        deleteChecklistMutation.mutate(
                          item.id,
                        )
                      }
                      className="text-neutral-300 transition-colors hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ADD CHECKLIST */}

            <div className="flex items-center gap-2">
              <input
                value={newChecklistText}
                onChange={(e) =>
                  setNewChecklistText(
                    e.target.value,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddChecklistItem()
                  }
                }}
                placeholder="Add checklist..."
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-dashed
                  border-black/[0.08]
                  bg-transparent
                  px-3
                  py-2
                  text-[11px]
                  text-neutral-600
                  outline-none
                  placeholder:text-neutral-300
                "
              />

              <button
                type="button"
                onClick={handleAddChecklistItem}
                disabled={
                  addChecklistMutation.isPending
                }
                className="
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-neutral-500
                  shadow-[0_3px_10px_rgba(0,0,0,0.04)]
                  transition
                  hover:bg-neutral-900
                  hover:text-white
                  disabled:opacity-40
                "
              >
                {addChecklistMutation.isPending ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={14} />
                )}
              </button>
            </div>

            {/* EDIT FOOTER */}

            <div className="mt-2 flex items-center justify-between gap-2 border-t border-black/[0.04] pt-4">
              {isConfirmingDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={
                      deleteNoteMutation.isPending
                    }
                    className="
                      rounded-full
                      bg-red-500
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-red-600
                      disabled:opacity-40
                    "
                  >
                    {deleteNoteMutation.isPending
                      ? 'Deleting...'
                      : 'Are you sure?'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmingDelete(false)
                    }
                    className="
                      rounded-full
                      bg-white
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      text-neutral-500
                      hover:bg-neutral-100
                    "
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    text-neutral-400
                    transition
                    hover:bg-white/70
                    hover:text-red-500
                  "
                >
                  <Trash2 size={11} />
                  Delete
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    rounded-full
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-neutral-400
                    hover:bg-white/70
                    hover:text-neutral-700
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    updateNoteMutation.isPending ||
                    !title.trim()
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-neutral-900
                    px-4
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-black
                    disabled:opacity-40
                  "
                >
                  {updateNoteMutation.isPending && (
                    <Loader2
                      size={10}
                      className="animate-spin"
                    />
                  )}

                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------------- */
          /* VIEW MODE                                                       */
          /* -------------------------------------------------------------- */

          <button
            type="button"
            onClick={handleOpenEdit}
            className="mt-5 block w-full text-left"
          >
            <h3
              className="
                break-words
                text-[15px]
                font-semibold
                leading-[1.35]
                tracking-[-0.025em]
                text-neutral-900
              "
            >
              {note.title}
            </h3>

            {note.content && (
              <p
                className="
                  mt-2
                  whitespace-pre-line
                  break-words
                  text-[12px]
                  leading-[1.75]
                  tracking-[-0.005em]
                  text-neutral-500
                "
              >
                {note.content}
              </p>
            )}

            {/* CHECKLIST */}

            {note.checklist_items.length > 0 && (
              <div className="mt-4 space-y-1.5">
                {note.checklist_items
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2"
                    >
                      {item.is_completed ? (
                        <CheckSquare
                          size={13}
                          className="shrink-0 text-emerald-500"
                        />
                      ) : (
                        <Square
                          size={13}
                          className="shrink-0 text-neutral-300"
                        />
                      )}

                      <span
                        className={`
                          min-w-0
                          truncate
                          text-[11.5px]
                          ${item.is_completed
                            ? 'text-neutral-400 line-through'
                            : 'text-neutral-600'
                          }
                        `}
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}

                {note.checklist_items.length > 4 && (
                  <p className="pl-5 text-[10px] text-neutral-400">
                    +
                    {note.checklist_items.length - 4}{' '}
                    more
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2 pl-5">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                    <div
                      className="h-full rounded-full bg-neutral-400 transition-all"
                      style={{
                        width: `${(completedCount /
                          note.checklist_items
                            .length) *
                          100
                          }%`,
                      }}
                    />
                  </div>

                  <span className="shrink-0 text-[9px] font-medium text-neutral-400">
                    {completedCount}/
                    {note.checklist_items.length}
                  </span>
                </div>
              </div>
            )}

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-black/[0.045] pt-3">
              <span className="max-w-[120px] truncate text-[9.5px] font-medium text-neutral-400">
                {editorName}
              </span>

              <span className="shrink-0 text-[9.5px] text-neutral-300">
                {formatRelativeTime(
                  note.updated_at,
                )}
              </span>
            </div>
          </button>
        )}
      </div>
    </article>
  )
}