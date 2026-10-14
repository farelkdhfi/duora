// features/relationship/components/delete-relationship-section.tsx

'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { useMyRelationshipDetails, useDeleteMyRelationship } from '../queries'

export default function DeleteRelationshipSection() {
  const { data } = useMyRelationshipDetails()
  const deleteRelationship = useDeleteMyRelationship()

  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const relationshipName = data?.relationship?.name

  if (!relationshipName) return null

  const isMatch =
    confirmText.trim().toLowerCase() === relationshipName.trim().toLowerCase()

  function handleDelete() {
    if (!isMatch) return
    deleteRelationship.mutate(confirmText)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-red-100 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[11px] bg-red-50">
          <AlertTriangle size={15} className="text-red-500" />
        </div>

        <div>
          <p className="text-[13px] font-semibold text-neutral-900">
            Delete relationship
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">
            Menghapus relationship akan menghapus permanen semua data kalian
            berdua (goals, check-in, Q&A, planner, countdown, debat, dan
            langganan). Pasanganmu tidak perlu menyetujui dan tindakan ini
            tidak bisa dibatalkan.
          </p>
        </div>
      </div>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-5 rounded-[14px] border border-red-200 px-4 py-2.5 text-[12px] font-semibold text-red-500 transition hover:bg-red-50"
        >
          Delete relationship
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <label className="block text-[12px] text-neutral-500">
            Ketik{' '}
            <span className="font-semibold text-neutral-900">
              {relationshipName}
            </span>{' '}
            untuk mengonfirmasi
          </label>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={relationshipName}
            className="min-h-12 w-full rounded-[16px] border border-red-100 bg-neutral-50 px-4 py-3 text-[14px] outline-none focus:border-red-300 focus:bg-white"
          />

          {deleteRelationship.isError && (
            <p className="text-[12px] font-medium text-red-500">
              {deleteRelationship.error.message.includes('CONFIRMATION_MISMATCH')
                ? 'Nama tidak cocok.'
                : 'Gagal menghapus relationship. Coba lagi.'}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!isMatch || deleteRelationship.isPending}
              className="flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-red-500 px-5 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleteRelationship.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus permanen'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setConfirmText('')
              }}
              className="min-h-11 rounded-[14px] border border-black/[0.06] px-5 text-[12px] font-medium text-neutral-500 hover:bg-neutral-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}