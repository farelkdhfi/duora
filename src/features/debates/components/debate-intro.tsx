'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'

interface DebateIntroProps {
    title: string
    partnerAName: string
    partnerBName: string
    partnerAAvatarUrl?: string | null
    partnerBAvatarUrl?: string | null
    onComplete: () => void
}

export default function DebateIntro({
    title,
    partnerAName,
    partnerBName,
    partnerAAvatarUrl,
    partnerBAvatarUrl,
    onComplete,
}: DebateIntroProps) {
    const [phase, setPhase] = useState<
        'enter' | 'hold' | 'exit'
    >('enter')

    useEffect(() => {
        const holdTimer = window.setTimeout(() => {
            setPhase('hold')
        }, 900)

        const exitTimer = window.setTimeout(() => {
            setPhase('exit')
        }, 4000)

        const completeTimer = window.setTimeout(() => {
            onComplete()
        }, 4700)

        return () => {
            window.clearTimeout(holdTimer)
            window.clearTimeout(exitTimer)
            window.clearTimeout(completeTimer)
        }
    }, [onComplete])

    const isExit = phase === 'exit'

    return (
        <>
            <style jsx>{`
        @keyframes debate-intro-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes debate-intro-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes debate-intro-left {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes debate-intro-right {
          from {
            opacity: 0;
            transform: translateX(28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes debate-intro-center {
          from {
            opacity: 0;
            transform: scale(0.75);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes debate-intro-orb {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.45;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.7;
          }
        }
      `}</style>

            <div
                className={[
                    'fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f7f6f2] transition-opacity duration-500',
                    isExit
                        ? 'pointer-events-none opacity-0'
                        : 'opacity-100',
                ].join(' ')}
            >
                {/* AMBIENT */}

                <div className="pointer-events-none absolute left-[18%] top-[28%] size-40 rounded-full bg-pink-300/[0.10] blur-[80px] sm:size-56" />

                <div className="pointer-events-none absolute bottom-[22%] right-[18%] size-40 rounded-full bg-blue-300/[0.09] blur-[80px] sm:size-56" />

                <div
                    className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eadfce]/[0.10] blur-[90px]"
                    style={{
                        animation:
                            'debate-intro-orb 4s ease-in-out infinite',
                    }}
                />

                {/* CONTENT */}

                <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">

                    {/* DUORA */}

                    <div
                        className="mb-8 opacity-0"
                        style={{
                            animation:
                                'debate-intro-fade-up 700ms ease-out 100ms forwards',
                        }}
                    >
                        <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-neutral-400 sm:text-[9px]">
                            Duora
                        </p>
                    </div>

                    {/* TWO PEOPLE */}

                    <div className="relative flex items-center justify-center gap-10 sm:gap-16">

                        {/* LEFT */}

                        <div
                            className="flex flex-col items-center opacity-0"
                            style={{
                                animation:
                                    'debate-intro-left 700ms ease-out 300ms forwards',
                            }}
                        >
                            <div className="relative flex size-[68px] items-center justify-center rounded-full border border-black/[0.045] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:size-[82px]">
                                <div className="absolute inset-[4px] rounded-full bg-[#f8f7f3] sm:inset-[5px]" />

                                {partnerAAvatarUrl ? (
                                    <img
                                        src={partnerAAvatarUrl}
                                        alt={partnerAName}
                                        className="relative z-10 size-[60px] rounded-full object-cover sm:size-[74px]"
                                    />
                                ) : (
                                    <Image
                                        src={happyEmot}
                                        alt={partnerAName}
                                        width={64}
                                        height={64}
                                        className="relative z-10 size-[52px] object-contain sm:size-[64px]"
                                    />
                                )}
                            </div>

                            <p className="mt-3 max-w-[100px] truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[9px]">
                                {partnerAName}
                            </p>
                        </div>

                        {/* CENTER */}

                        <div
                            className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)] opacity-0 sm:size-14"
                            style={{
                                animation:
                                    'debate-intro-center 650ms ease-out 550ms forwards',
                            }}
                        >
                            <div className="absolute -inset-3 rounded-full bg-[#eadfce]/30 blur-xl" />

                            <span className="relative text-[15px] text-neutral-400 sm:text-[18px]">
                                ✦
                            </span>
                        </div>

                        {/* RIGHT */}

                        <div
                            className="flex flex-col items-center opacity-0"
                            style={{
                                animation:
                                    'debate-intro-right 700ms ease-out 300ms forwards',
                            }}
                        >
                            <div className="relative flex size-[68px] items-center justify-center rounded-full border border-black/[0.045] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:size-[82px]">
                                <div className="absolute inset-[4px] rounded-full bg-[#f8f7f3] sm:inset-[5px]" />

                                {partnerBAvatarUrl ? (
                                    <img
                                        src={partnerBAvatarUrl}
                                        alt={partnerBName}
                                        className="relative z-10 size-[60px] rounded-full object-cover sm:size-[74px]"
                                    />
                                ) : (
                                    <Image
                                        src={neutralEmot}
                                        alt={partnerBName}
                                        width={64}
                                        height={64}
                                        className="relative z-10 size-[52px] object-contain sm:size-[64px]"
                                    />
                                )}
                            </div>

                            <p className="mt-3 max-w-[100px] truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[9px]">
                                {partnerBName}
                            </p>
                        </div>
                    </div>

                    {/* SLOGAN */}

                    <div
                        className="mt-12 opacity-0 sm:mt-14"
                        style={{
                            animation:
                                'debate-intro-fade-up 800ms ease-out 700ms forwards',
                        }}
                    >
                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-300 sm:text-[11px] sm:tracking-[0.3em]">
                            Two perspectives.
                        </p>

                        <h1 className="mt-2 text-[27px] font-semibold tracking-[-0.055em] text-neutral-900 sm:text-[38px]">
                            One conversation.
                        </h1>

                        <p className="mx-auto mt-3 max-w-[280px] truncate text-[9px] text-neutral-400 sm:text-[10px]">
                            {title}
                        </p>
                    </div>

                    {/* BOTTOM LINE */}

                    <div
                        className="mt-10 flex items-center gap-2 opacity-0 sm:mt-12"
                        style={{
                            animation:
                                'debate-intro-fade 700ms ease-out 1000ms forwards',
                        }}
                    >
                        <span className="size-1 rounded-full bg-neutral-300" />

                        <span className="text-[7px] font-medium uppercase tracking-[0.18em] text-neutral-300 sm:text-[8px]">
                            Find a place in the middle
                        </span>

                        <span className="size-1 rounded-full bg-neutral-300" />
                    </div>
                </div>
            </div>
        </>
    )
}