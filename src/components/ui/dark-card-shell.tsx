import type { ReactNode } from 'react'

/* Glow biru (kanan atas) + pink (kiri bawah) di atas dasar gelap,
   satu keluarga dengan RelationshipCard dan PartnerCheckinCard. */
const SHELL_BG = [
  'radial-gradient(ellipse 60% 70% at 100% 0%, rgba(90,130,210,0.16) 0%, rgba(90,130,210,0) 100%)',
  'radial-gradient(ellipse 60% 70% at 0% 100%, rgba(214,100,150,0.13) 0%, rgba(214,100,150,0) 100%)',
  'linear-gradient(to bottom, #15151b 0%, #0a0a0c 100%)',
].join(', ')

export default function DarkCardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0a0a0c] shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)]"
      style={{ backgroundImage: SHELL_BG }}
    >
     

     

      <svg
        className="pointer-events-none absolute right-8 top-8 size-16 opacity-[0.55]"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="23" stroke="#ffffff" strokeOpacity=".12" />
        <circle cx="32" cy="32" r="17" stroke="#e9a8bd" strokeOpacity=".4" strokeDasharray="2 6" />
        <circle cx="32" cy="32" r="10" stroke="#9eb9df" strokeOpacity=".38" />
        <circle cx="48" cy="21" r="2" fill="#e9a8bd" />
        <circle cx="20" cy="46" r="1.7" fill="#9eb9df" />
      </svg>

      <div className="relative p-5 sm:p-6">{children}</div>
    </div>
  )
}