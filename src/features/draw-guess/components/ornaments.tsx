import type { CSSProperties } from 'react'

interface OrnamentProps {
  className?: string
  style?: CSSProperties
}

export function Sparkle({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="currentColor" />
    </svg>
  )
}

export function HeartOutline({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M12 21S3 15.5 3 8.9C3 6.2 5.1 4 7.8 4c1.7 0 3.1.9 4.2 2.4C13.1 4.9 14.5 4 16.2 4C18.9 4 21 6.2 21 8.9C21 15.5 12 21 12 21Z" />
    </svg>
  )
}

export function Plus({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} style={style} aria-hidden="true">
      <path d="M12 4v16M4 12h16" />
    </svg>
  )
}

export function Ring({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style} aria-hidden="true">
      <circle cx="24" cy="24" r="20" strokeDasharray="3 6" strokeLinecap="round" />
    </svg>
  )
}

export function Squiggle({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 96 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} style={style} aria-hidden="true">
      <path d="M2 8c8-10 14-10 22 0s14 10 22 0 14-10 22 0 14 10 22 0" strokeDasharray="6 8" className="animate-dash motion-reduce:animate-none" />
    </svg>
  )
}

export function OrbitRing({ className = '', style }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} style={style} aria-hidden="true">
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" />
      <path d="M60 0C60.5 4 63 6.5 67 7C63 7.5 60.5 10 60 14C59.5 10 57 7.5 53 7C57 6.5 59.5 4 60 0Z" fill="currentColor" />
      <circle cx="60" cy="114" r="3" fill="currentColor" />
    </svg>
  )
}

/* ornamen latar halaman */
export function PageOrnaments() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-pink-500/10 blur-[100px]" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/10 blur-[100px]" />

      <OrbitRing className="absolute -left-16 top-[22%] size-44 animate-orbit text-pink-300/20 motion-reduce:animate-none" />
      <OrbitRing className="absolute -right-20 bottom-[18%] size-52 animate-orbit text-blue-300/20 [animation-direction:reverse] motion-reduce:animate-none" />

      <HeartOutline className="absolute right-[7%] top-[9%] size-9 animate-float text-pink-300/30 motion-reduce:animate-none" />
      <HeartOutline className="absolute left-[5%] top-[52%] size-6 animate-float-slow text-blue-300/30 motion-reduce:animate-none" style={{ animationDelay: '1.5s' }} />
      <Ring className="absolute bottom-[12%] right-[16%] size-10 animate-float-slow text-amber-200/30 motion-reduce:animate-none" />

      <Plus className="absolute left-[20%] top-[7%] size-4 animate-twinkle text-blue-300/40 motion-reduce:animate-none" />
      <Plus className="absolute bottom-[30%] right-[6%] size-3 animate-twinkle text-pink-300/40 motion-reduce:animate-none" style={{ animationDelay: '1.2s' }} />

      <Sparkle className="absolute left-[6%] top-[14%] size-4 animate-twinkle text-pink-300/60 motion-reduce:animate-none" />
      <Sparkle className="absolute right-[10%] top-[30%] size-5 animate-twinkle text-blue-300/50 motion-reduce:animate-none" style={{ animationDelay: '1s' }} />
      <Sparkle className="absolute bottom-[22%] left-[12%] size-3 animate-twinkle text-amber-200/60 motion-reduce:animate-none" style={{ animationDelay: '2s' }} />
      <Sparkle className="absolute bottom-[6%] right-[34%] size-3 animate-twinkle text-pink-300/50 motion-reduce:animate-none" style={{ animationDelay: '0.6s' }} />

      <Squiggle className="absolute bottom-[9%] left-[8%] w-24 text-pink-300/30" />
      <Squiggle className="absolute right-[10%] top-[40%] w-20 rotate-12 text-blue-300/30" />
    </div>
  )
}

/* ledakan sparkle untuk modal berhasil */
const PIECES = [
  { tx: -120, ty: -90, color: 'text-pink-400', size: 'size-4', delay: 0 },
  { tx: 110, ty: -100, color: 'text-blue-400', size: 'size-5', delay: 0.05 },
  { tx: -140, ty: -10, color: 'text-amber-300', size: 'size-3', delay: 0.1 },
  { tx: 140, ty: -20, color: 'text-pink-300', size: 'size-3', delay: 0.15 },
  { tx: -90, ty: 80, color: 'text-blue-300', size: 'size-4', delay: 0.2 },
  { tx: 100, ty: 90, color: 'text-amber-300', size: 'size-4', delay: 0.25 },
  { tx: 0, ty: -130, color: 'text-pink-400', size: 'size-3', delay: 0.3 },
  { tx: 0, ty: 120, color: 'text-blue-400', size: 'size-3', delay: 0.35 },
]

export function BurstSparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-20 size-0">
      {PIECES.map((p, i) => (
        <Sparkle
          key={i}
          className={`absolute -left-2 -top-2 animate-burst opacity-0 motion-reduce:hidden ${p.size} ${p.color}`}
          style={{ '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, animationDelay: `${p.delay}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}