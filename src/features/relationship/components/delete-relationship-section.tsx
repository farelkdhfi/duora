// features/relationship/components/delete-relationship-section.tsx

'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { getRelationshipErrorKey } from '../errors'
import { useMyRelationshipDetails, useDeleteMyRelationship } from '../queries'

export default function DeleteRelationshipSection() {
  const t = useTranslations('relationship.delete')
  const te = useTranslations('relationship.errors')
  const tc = useTranslations('common')

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
    <div className="relative w-full overflow-hidden rounded-[28px] border border-red-500/20 bg-primary p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[11px] bg-red-500/10">
          <AlertTriangle size={15} className="text-red-500" />
        </div>

        <div>
          <p className="text-[13px] font-semibold text-secondary">
            {t('title')}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-description">
            {t('warning')}
          </p>
        </div>
      </div>

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-5 rounded-[14px] border border-red-500/30 px-4 py-2.5 text-[12px] font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          {t('open')}
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <label className="block text-[12px] text-description">
            {t.rich('confirmPrompt', {
              relationshipName,
              name: (chunks) => (
                <span className="font-semibold text-secondary">{chunks}</span>
              ),
            })}
          </label>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={relationshipName}
            className="min-h-12 w-full rounded-[16px] border border-red-500/20 bg-subprimary/40 px-4 py-3 text-[14px] text-secondary outline-none placeholder:text-description focus:border-red-500/40 focus:bg-primary"
          />

          {deleteRelationship.isError && (
            <p className="text-[12px] font-medium text-red-500">
              {te(getRelationshipErrorKey(deleteRelationship.error))}
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
                  {t('deleting')}
                </>
              ) : (
                t('confirm')
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setConfirmText('')
              }}
              className="min-h-11 rounded-[14px] border border-white/[0.08] bg-subprimary px-5 text-[12px] font-medium text-secondary hover:bg-primary"
            >
              {tc('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}