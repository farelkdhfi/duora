'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { useStartDrawSession, useDrawChemistry } from '../queries'

export default function DrawLobby({ hasPartner }: { hasPartner: boolean }) {
  const { data: chem } = useDrawChemistry()
  const start = useStartDrawSession()

  const allSolved =
    (chem && chem.words_total > 0 && chem.words_remaining === 0) ||
    start.error?.message.includes('ALL_WORDS_SOLVED')

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-black/[0.06] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50">
        <Sparkles size={22} className="text-pink-500" />
      </div>

      <h1 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">Draw &amp; Guess</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Gantian menggambar dan menebak. Setiap tebakan benar menambah{' '}
        <span className="font-semibold text-neutral-800">+20 Chemistry</span> untuk kalian berdua.
      </p>

      {chem && (
        <p className="mt-4 text-xs text-neutral-400">
          {chem.words_remaining} dari {chem.words_total} kata belum terselesaikan
        </p>
      )}

      {allSolved ? (
        <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600">
          🎉 Semua kata sudah kalian selesaikan! Tunggu kata baru ya.
        </div>
      ) : !hasPartner ? (
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs text-amber-600">
          Game ini butuh pasanganmu sudah bergabung.
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => start.mutate()}
            disabled={start.isPending}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
          >
            {start.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Mulai Main'}
          </button>

          {start.isError && !allSolved && (
            <p className="mt-3 text-xs text-rose-500">Gagal memulai game. Coba lagi.</p>
          )}
        </>
      )}
    </div>
  )
}