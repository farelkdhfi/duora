'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Loader2,
    X,
} from 'lucide-react'

import { useCreateDebate } from '../queries'
import { AiPersona } from '../types'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'

interface CreateDebateModalProps {
    relationshipId: string
    open: boolean
    onClose: () => void
}

const personaOptions: {
    value: AiPersona
    label: string
    description: string
    image: typeof happyEmot
}[] = [
        {
            value: 'formal',
            label: 'Formal',
            description: 'Neutral & structured',
            image: neutralEmot,
        },
        {
            value: 'lembut',
            label: 'Lembut',
            description: 'Calm & empathetic',
            image: happyEmot,
        },
        {
            value: 'kasar',
            label: 'Nyeletuk',
            description: 'Casual & witty',
            image: stressedEmot,
        },
        {
            value: 'lebay',
            label: 'Lebay',
            description: 'Expressive & dramatic',
            image: tiredEmot,
        },
    ]

function PersonaPicker({
    selectedPersona,
    onSelect,
    className = '',
}: {
    selectedPersona: AiPersona
    onSelect: (persona: AiPersona) => void
    className?: string
}) {
    const [dragOffset, setDragOffset] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const pointerStart = useRef<number | null>(null)

    const selectedIndex = personaOptions.findIndex(
        (persona) => persona.value === selectedPersona,
    )

    const getWrappedIndex = (index: number) => {
        const length = personaOptions.length

        return ((index % length) + length) % length
    }

    const selectRelative = (direction: number) => {
        const nextIndex = getWrappedIndex(
            selectedIndex + direction,
        )

        onSelect(personaOptions[nextIndex].value)
    }

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        pointerStart.current = event.clientX
        setIsDragging(true)

        event.currentTarget.setPointerCapture(
            event.pointerId,
        )
    }

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (pointerStart.current === null) return

        const distance =
            event.clientX - pointerStart.current

        const limitedDistance = Math.max(
            -100,
            Math.min(100, distance),
        )

        setDragOffset(limitedDistance)
    }

    const handlePointerUp = () => {
        if (pointerStart.current === null) return

        const threshold = 45

        if (dragOffset > threshold) {
            selectRelative(-1)
        } else if (dragOffset < -threshold) {
            selectRelative(1)
        }

        pointerStart.current = null
        setDragOffset(0)
        setIsDragging(false)
    }

    const handlePointerCancel = () => {
        pointerStart.current = null
        setDragOffset(0)
        setIsDragging(false)
    }

    const visiblePersonas = [-2, -1, 0, 1, 2].map(
        (offset) => {
            const index = getWrappedIndex(
                selectedIndex + offset,
            )

            return {
                ...personaOptions[index],
                offset,
            }
        },
    )

    return (
        <div className={`w-full ${className}`}>
            {/* Persona stage */}
            <div className="relative w-full select-none touch-pan-y">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eadfce]/30 blur-[65px]" />

                {/* Icon stage */}
                <div className="relative h-[142px] w-full">
                    {visiblePersonas.map((persona) => {
                        const distance = Math.abs(persona.offset)
                        const isActive = persona.offset === 0

                        const translateX =
                            persona.offset * 118 +
                            dragOffset * (isActive ? 0.22 : 0.08)

                        const scale = isActive
                            ? 1
                            : distance === 1
                                ? 0.67
                                : 0.48

                        const opacity = isActive
                            ? 1
                            : distance === 1
                                ? 0.45
                                : 0.12

                        const blur = isActive
                            ? 'blur-0'
                            : distance === 1
                                ? 'blur-[0.4px]'
                                : 'blur-[1px]'

                        return (
                            <button
                                key={`${persona.value}-${persona.offset}`}
                                type="button"
                                onClick={() => {
                                    if (!isDragging && !isActive) {
                                        onSelect(persona.value)
                                    }
                                }}
                                aria-label={`Choose ${persona.label}`}
                                className={`absolute left-1/2 top-1/2 flex size-[142px] items-center justify-center outline-none ${isDragging
                                    ? 'duration-0'
                                    : 'duration-500'
                                    } ${blur}`}
                                style={{
                                    marginLeft: '-71px',
                                    marginTop: '-71px',
                                    transform: `
                    translateX(${translateX}px)
                    scale(${scale})
                  `,
                                    opacity,
                                }}
                            >
                                <Image
                                    src={persona.image}
                                    alt={persona.label}
                                    width={110}
                                    height={110}
                                    draggable={false}
                                    className="size-[105px] object-contain"
                                />
                            </button>
                        )
                    })}

                    {/* Swipe interaction */}
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        className={`absolute inset-0 cursor-grab touch-pan-y ${isDragging ? 'cursor-grabbing' : ''
                            }`}
                        aria-label="Swipe to choose AI personality"
                        role="slider"
                        aria-valuemin={0}
                        aria-valuemax={personaOptions.length - 1}
                        aria-valuenow={selectedIndex}
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'ArrowLeft') {
                                event.preventDefault()
                                selectRelative(-1)
                            }

                            if (event.key === 'ArrowRight') {
                                event.preventDefault()
                                selectRelative(1)
                            }
                        }}
                    />
                </div>

                {/* Persona information */}
                <div className="mt-3 flex items-center justify-center gap-6">
                    <button
                        type="button"
                        onClick={() => selectRelative(-1)}
                        aria-label="Previous persona"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <ArrowLeft
                            size={13}
                            strokeWidth={1.7}
                        />
                    </button>

                    <div className="min-w-[150px] text-center">
                        <p className="text-[15px] font-semibold tracking-[-0.035em] text-neutral-900">
                            {personaOptions[selectedIndex].label}
                        </p>

                        <p className="mt-1 text-sm text-neutral-400">
                            {personaOptions[selectedIndex].description}
                        </p>

                        <div className="mt-3 flex justify-center gap-1">
                            {personaOptions.map((persona, index) => (
                                <button
                                    key={persona.value}
                                    type="button"
                                    aria-label={`Select ${persona.label}`}
                                    onClick={() =>
                                        onSelect(persona.value)
                                    }
                                    className={`h-1 rounded-full transition-all duration-300 ${index === selectedIndex
                                        ? 'w-4 bg-neutral-900'
                                        : 'w-1 bg-neutral-200 hover:bg-neutral-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => selectRelative(1)}
                        aria-label="Next persona"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <ArrowRight
                            size={13}
                            strokeWidth={1.7}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CreateDebateModal({
    relationshipId,
    open,
    onClose,
}: CreateDebateModalProps) {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [selectedPersona, setSelectedPersona] =
        useState<AiPersona>('formal')

    const createDebateMutation =
        useCreateDebate(relationshipId)

    if (!open) return null

    const closeCreateModal = () => {
        if (createDebateMutation.isPending) return

        onClose()
    }

        const handleCreate = () => {
        if (!title.trim()) return

        createDebateMutation.mutate(
            {
                relationshipId,
                title: title.trim(),
                aiPersona: selectedPersona,
            },
            {
                onSuccess: (newDebate) => {
                    router.push(`/debates/${newDebate.id}`)
                },
            },
        )
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/30 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    closeCreateModal()
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-debate-title"
                className="relative flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-black/[0.06] bg-[#fafaf9] shadow-[0_30px_100px_-25px_rgba(0,0,0,0.35)] sm:max-h-[92vh] sm:rounded-[2rem]"
            >
                {/* Ambient background */}
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-300/[0.08] blur-[80px]" />

                <div className="pointer-events-none absolute -left-24 bottom-[-100px] size-64 rounded-full bg-blue-300/[0.07] blur-[80px]" />

                {/* Header */}
                <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-black/[0.045] px-5 py-5 sm:px-7 sm:py-6">
                    <div>
                        <h2
                            id="create-debate-title"
                            className="mt-1.5 text-sm font-semibold tracking-[-0.045em] text-neutral-900 sm:text-[22px]"
                        >
                            What are you disagreeing about?
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={closeCreateModal}
                        disabled={createDebateMutation.isPending}
                        aria-label="Close create debate modal"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm transition hover:bg-neutral-900 hover:text-white disabled:pointer-events-none disabled:opacity-40"
                    >
                        <X
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="debate-title"
                            className="mb-2 block text-sm font-semibold text-neutral-700"
                        >
                            Topic
                        </label>

                        <input
                            id="debate-title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' &&
                                    !event.shiftKey
                                ) {
                                    event.preventDefault()
                                    handleCreate()
                                }

                                if (event.key === 'Escape') {
                                    closeCreateModal()
                                }
                            }}
                            placeholder="Example: Where should we spend New Year's?"
                            autoFocus
                            className="h-12 w-full rounded-[1.1rem] border border-black/[0.08] bg-white px-4 text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-300 transition focus:border-black/[0.16] focus:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]"
                        />
                    </div>

                    {/* Persona */}
                    <div className="mt-7 overflow-x-hidden">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-neutral-700">
                                Choose your mediator
                            </p>

                            <p className="mt-1 text-sm text-neutral-400">
                                Swipe to change their personality.
                            </p>
                        </div>

                        <PersonaPicker
                            className='mt-5'
                            selectedPersona={selectedPersona}
                            onSelect={setSelectedPersona}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="relative shrink-0 border-t border-black/[0.045] bg-[#fafaf9]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={
                            createDebateMutation.isPending ||
                            !title.trim()
                        }
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-black disabled:pointer-events-none disabled:opacity-40"
                    >
                        {createDebateMutation.isPending && (
                            <Loader2
                                size={13}
                                className="animate-spin"
                            />
                        )}

                        Start debate

                        {!createDebateMutation.isPending && (
                            <ArrowUpRight
                                size={13}
                                strokeWidth={1.8}
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}