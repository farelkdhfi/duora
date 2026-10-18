'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check, Copy, Loader2 } from 'lucide-react'

import { getRelationshipErrorKey } from '@/features/relationship/errors'
import { useCancelPendingRelationship } from '@/features/relationship/queries'

import waitingImg from '@/assets/waiting/waiting-couple.png'

export default function WaitingForPartner({
  relationshipName,
  inviteCode,
  userName,
}: {
  relationshipName: string
  inviteCode: string
  userName: string
}) {
  const t = useTranslations('dashboard.waiting')
  const te = useTranslations('relationship.errors')
  const tc = useTranslations('common')

  const [copied, setCopied] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const cancelRelationship = useCancelPendingRelationship()

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleCancel() {
  cancelRelationship.mutate()
}

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 bg-primary">
      <div className="relative mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[2rem] bg-primary p-8 text-center  sm:p-10">
          <div className="mx-auto mb-6 flex w-[80%] items-center justify-center">
            <Image src={waitingImg} alt={t('imageAlt')} />
          </div>

          <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">
            {relationshipName}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-xs text-description">
            {t('instruction')}
          </p>

          <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-full bg-black px-4 py-3">
            <span className="text-lg font-semibold tracking-[0.2em] text-white">
              {inviteCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? t('copied') : t('copy')}
              className="ml-2 flex size-8 items-center justify-center rounded-lg text-white"
            >
              {copied ? (
                <Check size={15} className="text-white" />
              ) : (
                <Copy size={15} />
              )}
            </button>
          </div>

          {/* CANCEL / SALAH PILIH */}
          <div className="mt-8 border-t border-white/30 pt-6">
            {!isConfirming ? (
              <>
                <p className="text-xs text-description">{t('wrongPick')}</p>

                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  className="mt-3 text-xs font-medium text-red-500 underline-offset-2 hover:underline"
                >
                  {t('deleteRelationship')}
                </button>
              </>
            ) : (
              <div>
                <p className="text-xs text-white">
                  {t('confirmDelete', { name: relationshipName })}
                </p>

                {cancelRelationship.isError && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {te(getRelationshipErrorKey(cancelRelationship.error))}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelRelationship.isPending}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-full border-pink-300 border px-4 text-xs font-semibold text-white  disabled:opacity-50"
                  >
                    {cancelRelationship.isPending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        {t('deleting')}
                      </>
                    ) : (
                      t('confirmYes')
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    disabled={cancelRelationship.isPending}
                    className="min-h-10 rounded-xl border border-black/[0.06] px-4 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
                  >
                    {tc('cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}