'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Loader2,
  MessageSquareText,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

import {
  useCreateDebate,
  useDebates,
  useDeleteDebate,
} from '../queries'

interface DebateListProps {
  relationshipId: string
}

const statusLabel = {
  active: {
    text: 'Berlangsung',
    color: 'bg-emerald-50 text-emerald-600',
  },
  pending_verdict: {
    text: 'Menyusun kesimpulan',
    color: 'bg-amber-50 text-amber-600',
  },
  resolved: {
    text: 'Selesai',
    color: 'bg-neutral-100 text-neutral-500',
  },
  archived: {
    text: 'Diarsipkan',
    color: 'bg-neutral-100 text-neutral-400',
  },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function DebateListItem({
  debate,
  relationshipId,
}: {
  debate: ReturnType<typeof useDebates>['data'] extends
    | (infer T)[]
    | undefined
    ? T
    : never
  relationshipId: string
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const deleteDebateMutation = useDeleteDebate(
    relationshipId,
  )

  const status = statusLabel[debate.status]

  const handleDeleteClick = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteDebateMutation.mutate(debate.id)
  }

  const handleCancelClick = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirmingDelete(false)
  }

  return (
    <Link
      href={`/debates/${debate.id}`}
      className="
        group
        flex
        items-center
        justify-between
        gap-3
        rounded-[1.5rem]
        border
        border-black/[0.06]
        bg-white
        p-4
        shadow-[0_8px_24px_rgba(0,0,0,0.04)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]
        sm:p-5
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-pink-50">
          <Sparkles
            size={14}
            strokeWidth={2}
            className="text-blue-500"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[13.5px] font-semibold tracking-[-0.02em] text-neutral-900">
            {debate.title}
          </h3>

          <p className="mt-0.5 text-[10.5px] text-neutral-400">
            {formatDate(debate.created_at)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isConfirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={
                deleteDebateMutation.isPending
              }
              className="rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleteDebateMutation.isPending
                ? '...'
                : 'Yakin?'}
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              disabled={
                deleteDebateMutation.isPending
              }
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[9px] font-semibold text-neutral-500 hover:bg-neutral-200 disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="
              flex
              size-7
              items-center
              justify-center
              rounded-full
              text-neutral-300
              opacity-0
              transition-all
              hover:bg-red-50
              hover:text-red-500
              group-hover:opacity-100
            "
          >
            <Trash2 size={12} strokeWidth={2} />
          </button>
        )}

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[9.5px]
            font-semibold
            ${status.color}
          `}
        >
          {status.text}
        </span>
      </div>
    </Link>
  )
}

export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const {
    data: debates,
    isLoading,
  } = useDebates(relationshipId)

  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')

  const createDebateMutation = useCreateDebate(
    relationshipId,
  )

  const handleCreate = () => {
    if (!title.trim()) return

    createDebateMutation.mutate(
      {
        relationshipId,
        title: title.trim(),
      },
      {
        onSuccess: () => {
          setTitle('')
          setShowCreate(false)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-[1.5rem] bg-neutral-100"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* CREATE */}

      <div className="mb-5">
        {showCreate ? (
          <div className="rounded-[1.5rem] border border-black/[0.08] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreate()
                  }
                }}
                placeholder="Topik diskusi, misal: Rencana liburan akhir tahun"
                autoFocus
                className="
                  w-full
                  rounded-xl
                  border
                  border-black/[0.06]
                  bg-[#f8f8f7]
                  px-3.5
                  py-2.5
                  text-[13px]
                  text-neutral-900
                  outline-none
                  focus:border-black/[0.12]
                  focus:bg-white
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleCreate}
                disabled={
                  createDebateMutation.isPending ||
                  !title.trim()
                }
                className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2 text-[12px] font-semibold text-white hover:bg-black disabled:opacity-50"
              >
                {createDebateMutation.isPending && (
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                )}
                Mulai diskusi
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
            Mulai diskusi baru
          </button>
        )}
      </div>

      {/* EMPTY */}

      {!debates?.length && !showCreate && (
        <div className="rounded-[2rem] border border-black/[0.06] bg-white p-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-neutral-50">
            <MessageSquareText
              size={18}
              strokeWidth={1.8}
              className="text-neutral-300"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-neutral-800">
            Belum ada diskusi
          </h3>

          <p className="mx-auto mt-2 max-w-[240px] text-[12px] leading-5 text-neutral-400">
            Diskusikan hal yang belum sepaham
            dengan bantuan AI mediator netral.
          </p>
        </div>
      )}

      {/* LIST */}

      {Boolean(debates?.length) && (
        <div className="space-y-3">
          {debates!.map((debate) => (
            <DebateListItem
              key={debate.id}
              debate={debate}
              relationshipId={relationshipId}
            />
          ))}
        </div>
      )}
    </div>
  )
}