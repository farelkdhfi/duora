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

  if (diffMinutes < 1) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes}m lalu`
  if (diffHours < 24) return `${diffHours}j lalu`
  if (diffDays < 7) return `${diffDays}h lalu`

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

  const completedCount = note.checklist_items.filter(
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
    <div
      className={`
        mb-4
        break-inside-avoid
        overflow-hidden
        rounded-[1.5rem]
        border
        ${color.border}
        ${color.bg}
        shadow-[0_8px_24px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        ${!isEditing ? 'hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]' : ''}
      `}
    >
      <div className="p-4 sm:p-5">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {note.category && (
              <span
                className={`
                  inline-flex
                  items-center
                  rounded-full
                  bg-white/70
                  px-2.5
                  py-1
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  ${color.text}
                `}
              >
                {note.category}
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`
                flex
                size-6
                items-center
                justify-center
                rounded-full
                transition-colors
                hover:bg-white/70
                ${note.is_favorite ? 'text-amber-500' : 'text-neutral-300'}
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
                size-6
                items-center
                justify-center
                rounded-full
                transition-colors
                hover:bg-white/70
                ${note.is_pinned ? 'text-neutral-900' : 'text-neutral-300'}
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

        {/* ================================================= */}
        {/* EDIT MODE */}
        {/* ================================================= */}

        {isEditing ? (
          <div className="mt-3 space-y-3">
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Judul catatan"
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-black/[0.06]
                bg-white
                px-3.5
                py-2.5
                text-[14px]
                font-semibold
                text-neutral-900
                outline-none
                focus:border-black/[0.12]
              "
            />

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Tulis catatan..."
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-black/[0.06]
                bg-white
                px-3.5
                py-2.5
                text-[13px]
                leading-6
                text-neutral-700
                outline-none
                focus:border-black/[0.12]
              "
            />

            <input
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              placeholder="Kategori (opsional)"
              className="
                w-full
                rounded-xl
                border
                border-black/[0.06]
                bg-white
                px-3.5
                py-2.5
                text-[12px]
                text-neutral-600
                outline-none
                focus:border-black/[0.12]
              "
            />

            {/* CHECKLIST EDIT */}

            <div className="space-y-1.5">
              {note.checklist_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg bg-white/70 px-2.5 py-1.5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleChecklistMutation.mutate(
                        {
                          itemId: item.id,
                          isCompleted:
                            !item.is_completed,
                        },
                      )
                    }
                    className="shrink-0 text-neutral-400"
                  >
                    {item.is_completed ? (
                      <CheckSquare
                        size={15}
                        className="text-emerald-500"
                      />
                    ) : (
                      <Square size={15} />
                    )}
                  </button>

                  <span
                    className={`
                      flex-1
                      truncate
                      text-[12px]
                      ${item.is_completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}
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
                    className="shrink-0 text-neutral-300 hover:text-red-500"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}

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
                  placeholder="Tambah checklist..."
                  className="
                    flex-1
                    rounded-lg
                    border
                    border-dashed
                    border-black/[0.1]
                    bg-transparent
                    px-2.5
                    py-1.5
                    text-[12px]
                    text-neutral-600
                    outline-none
                    placeholder:text-neutral-400
                  "
                />

                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-500 hover:bg-neutral-100"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* FOOTER EDIT */}

            <div className="flex items-center justify-between gap-2 pt-1">
              {isConfirmingDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={
                      deleteNoteMutation.isPending
                    }
                    className="rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleteNoteMutation.isPending
                      ? 'Menghapus...'
                      : 'Yakin hapus?'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmingDelete(false)
                    }
                    className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:bg-neutral-100"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-neutral-400 hover:bg-white/70 hover:text-red-500"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full px-3.5 py-1.5 text-[11px] font-medium text-neutral-500 hover:bg-white/70"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    updateNoteMutation.isPending ||
                    !title.trim()
                  }
                  className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  {updateNoteMutation.isPending && (
                    <Loader2
                      size={11}
                      className="animate-spin"
                    />
                  )}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================= */
          /* VIEW MODE */
          /* ================================================= */

          <button
            type="button"
            onClick={handleOpenEdit}
            className="mt-3 block w-full text-left"
          >
            <h3 className="break-words text-[15px] font-semibold leading-snug tracking-[-0.02em] text-neutral-900">
              {note.title}
            </h3>

            {note.content && (
              <p className="mt-1.5 whitespace-pre-line break-words text-[12.5px] leading-6 text-neutral-500">
                {note.content}
              </p>
            )}

            {note.checklist_items.length > 0 && (
              <div className="mt-3 space-y-1">
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
                          truncate
                          text-[12px]
                          ${item.is_completed ? 'text-neutral-400 line-through' : 'text-neutral-600'}
                        `}
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}

                {note.checklist_items.length > 4 && (
                  <p className="pl-5 text-[11px] text-neutral-400">
                    +{note.checklist_items.length - 4} lainnya
                  </p>
                )}

                <p className="pl-5 text-[10px] font-medium text-neutral-400">
                  {completedCount}/
                  {note.checklist_items.length} selesai
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/[0.05] pt-3">
              <span className="truncate text-[10px] text-neutral-400">
                {editorName}
              </span>

              <span className="shrink-0 text-[10px] text-neutral-400">
                {formatRelativeTime(
                  note.updated_at,
                )}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}