'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Copy, Loader2, Lock } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const cancelRelationship = useCancelPendingRelationship()

  function handleCopy() {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleCancel() {
    cancelRelationship.mutate(undefined, {
      onError: () => setIsConfirming(false),
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10">
      <div className="relative mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white/80 p-8 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto mb-6 flex w-[80%] items-center justify-center">
            <Image src={waitingImg} alt='waiting-image' />
          </div>

          <h2 className="text-xl font-semibold tracking-[-0.04em]">
            {relationshipName}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-xs text-neutral-500">
            Bagikan kode undangan ini kepada pasanganmu untuk mulai membangun ruang bersama di Duora.
          </p>

          <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-full border border-blue-400 bg-linear-to-tr from-pink-300 to-blue-300 px-4 py-3">
            <span className="text-lg font-semibold tracking-[0.2em] text-white">
              {inviteCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? 'Kode berhasil disalin' : 'Salin kode undangan'}
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
          <div className="mt-8 border-t border-black/[0.05] pt-6">
            {!isConfirming ? (
              <>
                <p className="text-xs text-neutral-400">
                  Salah pilih? Hapus relationship ini untuk bergabung dengan kode pasanganmu.
                </p>

                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  className="mt-3 text-xs font-medium text-red-500 underline-offset-2 hover:underline"
                >
                  Hapus relationship ini
                </button>
              </>
            ) : (
              <div>
                <p className="text-xs font-medium text-neutral-600">
                  Hapus &quot;{relationshipName}&quot; dan kode undangannya?
                  Kamu bisa membuat baru atau bergabung dengan kode pasanganmu
                  setelah ini.
                </p>

                {cancelRelationship.isError && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {cancelRelationship.error.message.includes('PARTNER_ALREADY_JOINED')
                      ? 'Pasanganmu sudah bergabung, relationship tidak bisa dibatalkan dari sini.'
                      : 'Gagal menghapus relationship. Coba lagi.'}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelRelationship.isPending}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-full border-pink-300 border px-4 text-xs font-semibold text-black transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {cancelRelationship.isPending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Menghapus...
                      </>
                    ) : (
                      'Ya, hapus'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    disabled={cancelRelationship.isPending}
                    className="min-h-10 rounded-xl border border-black/[0.06] px-4 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
                  >
                    Batal
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