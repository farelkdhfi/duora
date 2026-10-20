'use client'

import { forwardRef } from 'react'
import ChemistryIcon from './chemistry-icon'

interface Props {
  totalPoints: number
  correctCount: number
  names: [string, string]
}

const ChemistryShareCard = forwardRef<HTMLDivElement, Props>(
  ({ totalPoints, correctCount, names }, ref) => (
    <div
      ref={ref}
      className="relative flex aspect-[9/16] w-[540px] flex-col overflow-hidden bg-primary px-[8%] py-[7%] text-secondary"
    >
      <div className="pointer-events-none absolute -right-[25%] -top-[8%] h-[40%] w-[75%] rounded-full bg-pink-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -left-[25%] h-[40%] w-[75%] rounded-full bg-blue-500/20 blur-[100px]" />

      <header className="relative flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-description">
          Draw &amp; Guess
        </p>
        <p className="text-[15px] font-bold uppercase tracking-[-0.04em]">duonear</p>
      </header>

      <section className="relative mt-[16%] flex flex-1 flex-col items-center text-center">
        <ChemistryIcon size={150} />

        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.22em] text-description">
          Total Chemistry
        </p>

        <p className="mt-2 text-[96px] font-semibold leading-none tracking-[-0.08em]">
          {totalPoints.toLocaleString('id-ID')}
        </p>

        <div className="mt-8 rounded-full border border-white/[0.07] bg-subprimary px-6 py-3">
          <p className="text-[12px] font-semibold">
            {correctCount.toLocaleString('id-ID')} tebakan benar
          </p>
        </div>

        <p className="mt-10 text-[12px] font-medium text-description">
          {names[0]} <span className="text-pink-400">♥</span> {names[1]}
        </p>
      </section>

      <footer className="relative text-center">
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-description">
          made with duonear
        </p>
      </footer>
    </div>
  ),
)

ChemistryShareCard.displayName = 'ChemistryShareCard'
export default ChemistryShareCard