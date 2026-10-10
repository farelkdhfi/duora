'use client'

import {
  useEffect,
  useState,
  type ComponentProps,
  type CSSProperties,
} from 'react'
import { ArrowLeft, ArrowUpRight, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import DebateMessageBubble from './debate-message-bubble'
import DateSeparator from './date-separator'
import DebateIntro from './debate-intro'
import DebateComposer from './debate-composer'

import {
  useAutoFinalVerdict,
  useDebate,
  useDebateMessages,
  useResolveDebate,
} from '../queries'
import { AiPersona } from '../types'

import lembutAi from '@/assets/ai-persona/lembut-ai.png'
import formalAi from '@/assets/ai-persona/formal-ai.png'
import nyeletukAi from '@/assets/ai-persona/nyeletuk-ai.png'
import lebayAi from '@/assets/ai-persona/lebay-ai.png'
import AiMemoryPocket from './ai-memory-pocket'
import AiResponseOverlay from './ai-response-overlay'

interface DebateRoomProps {
  debateId: string
  relationshipId: string
  currentUserId: string
  members: Array<{
    user_id: string
    display_name: string | null
    username: string | null
    avatar_url?: string | null
  }>
}

type DebateMessage = ComponentProps<
  typeof DebateMessageBubble
>['message']

type EmoticonImage = typeof lembutAi

type Side = 'left' | 'right'

const statusConfig = {
  active: {
    label: 'Active',
    color: 'bg-emerald-400',
  },
  pending_verdict: {
    label: 'Preparing verdict',
    color: 'bg-amber-400',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-neutral-400',
  },
  archived: {
    label: 'Archived',
    color: 'bg-neutral-300',
  },
}

const personaLabel: Record<
  AiPersona,
  {
    text: string
    image: EmoticonImage
  }
> = {
  formal: {
    text: 'Formal',
    image: formalAi,
  },
  lembut: {
    text: 'Lembut',
    image: lembutAi,
  },
  kasar: {
    text: 'Nyeletuk',
    image: nyeletukAi,
  },
  lebay: {
    text: 'Lebay',
    image: lebayAi,
  },
}

/* Aksen halus per sisi: kiri = warm clay, kanan = dusty slate */
const sideTone: Record<
  Side,
  { ring: string; dot: string; label: string }
> = {
  left: {
    ring: 'ring-[#b8967a]/80',
    dot: 'bg-[#b8967a]',
    label: 'text-[#a07d62]',
  },
  right: {
    ring: 'ring-[#8fa3b5]/90',
    dot: 'bg-[#8fa3b5]',
    label: 'text-[#6f8396]',
  },
}

/* Arah datangnya transisi konten bubble */
const slideFrom: Record<Side, string> = {
  left: '-14px',
  right: '14px',
}

function getMemberName(
  member:
    | {
      user_id: string
      display_name: string | null
      username: string | null
    }
    | undefined,
) {
  return (
    member?.display_name ??
    member?.username ??
    'Partner'
  )
}

function isSameDay(dateA: string, dateB: string) {
  return (
    new Date(dateA).toDateString() ===
    new Date(dateB).toDateString()
  )
}

function formatThoughtCount(count: number) {
  return `${count} ${count === 1 ? 'pesan sebelumnya' : 'pesan sebelumnya'}`
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

/* ===================================================== */
/* AI MEDIATOR (TOP) */
/* ===================================================== */

function MediatorStage({
  persona,
  isProcessing,
  hasAiComment,
  isPendingVerdict,
  onOpenHistory,
}: {
  persona: {
    text: string
    image: EmoticonImage
  }
  isProcessing: boolean
  hasAiComment: boolean
  isPendingVerdict: boolean
  onOpenHistory: () => void
}) {
  const active =
    isProcessing ||
    isPendingVerdict ||
    hasAiComment


  return (
    <section className="relative flex w-full flex-col items-center">
      <button
        type="button"
        onClick={onOpenHistory}
        aria-label="Open Duora AI memory"
        className="group relative z-10 flex flex-col items-center rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-400"
      >
        

          <span className="relative z-10 block size-23 sm:size-[40px]">
            <Image
              key={persona.text}
              src={persona.image}
              alt=""
              fill
              sizes="40px"
              className="animate-[debate-content-in_0.6s_cubic-bezier(0.22,1,0.36,1)_both] object-contain motion-reduce:animate-none"
            />
          </span>

        <span className="mt-2 text-xs font-semibold text-neutral-800">
          {persona.text} mediator
        </span>

        <span className="mt-2 bg-white py-2 px-4 rounded-full shadow-md text-[10px] text-neutral-800 transition-colors duration-300 group-hover:text-neutral-700">
          Lihat jawaban
        </span>
      </button>
    </section>
  )
}

/* ===================================================== */
/* PARTNER AVATAR */
/* ===================================================== */

function PartnerAvatar({
  name,
  image,
  avatarUrl,
  side,
  isActive,
  isDimmed,
  disabled,
  onSelect,
}: {
  name: string
  image: EmoticonImage
  avatarUrl?: string | null
  side: Side
  isActive: boolean
  isDimmed: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const tone = sideTone[side]

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={`Show ${name}'s latest thought`}
      className="group relative flex flex-col items-center rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-400 disabled:cursor-default"
    >
      <span
        className={[
          'relative block size-[68px] rounded-full ring-offset-[5px] ring-offset-[#faf9f6] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:size-[76px]',
          isActive
            ? `scale-100 ring-[1.5px] ${tone.ring}`
            : 'ring-1 ring-black/[0.06]',
          isDimmed
            ? 'scale-[0.9] opacity-55 saturate-[0.6] group-hover:opacity-90 group-hover:saturate-100'
            : '',
        ].join(' ')}
      >
        <span className="relative block size-full overflow-hidden rounded-full bg-[#f3eee6]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <Image
              src={image}
              alt=""
              fill
              sizes="76px"
              className="object-contain p-3"
            />
          )}
        </span>
      </span>

      <span className="mt-4 flex flex-col items-center gap-2">
        <span
          className={[
            'max-w-[110px] truncate text-[12px] font-medium tracking-[-0.01em] transition-colors duration-500',
            isActive
              ? 'text-neutral-900'
              : 'text-neutral-400',
          ].join(' ')}
        >
          {name}
        </span>

        <span
          className={[
            'size-1 rounded-full transition-all duration-500',
            tone.dot,
            isActive
              ? 'scale-100 opacity-100'
              : 'scale-0 opacity-0',
          ].join(' ')}
        />
      </span>
    </button>
  )
}

/* ===================================================== */
/* ACTIVE BUBBLE (SINGLE) */
/* ===================================================== */

function ActiveBubble({
  side,
  name,
  message,
  previousCount,
  emptyText,
  onOpenPocket,
}: {
  side: Side
  name: string
  message: DebateMessage | undefined
  previousCount: number
  emptyText: string
  onOpenPocket: () => void
}) {
  const tone = sideTone[side]

  return (
    <div className="relative" aria-live="polite">
      {/* pointer yang meluncur ke avatar aktif */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-black/[0.06] bg-white transition-[left] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ left: side === 'left' ? '25%' : '75%' }}
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-lg">
        <div
          key={`${side}-${message?.id ?? 'empty'}`}
          className="animate-[debate-content-in_0.6s_cubic-bezier(0.22,1,0.36,1)_both] p-6 motion-reduce:animate-none sm:p-8"
          style={
            {
              '--from-x': slideFrom[side],
            } as CSSProperties
          }
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className={[
                'text-[9px] font-semibold uppercase',
                tone.label,
              ].join(' ')}
            >
              {name}
            </p>

            {message && (
              <span className="text-[10px] tabular-nums text-neutral-600">
                {formatTime(message.created_at)}
              </span>
            )}
          </div>

          {message ? (
            <p className="mt-5 whitespace-pre-line break-words  text-sm leading-[1.7] tracking-[-0.01em] text-neutral-800 sm:text-[19px]">
              {message.content}
            </p>
          ) : (
            <p className="mt-5  text-[16px] italic leading-[1.7] text-neutral-300 sm:text-[17px]">
              {emptyText}
            </p>
          )}

          {previousCount > 0 && (
            <div className="mt-7 border-t border-black/[0.05] pt-4">
              <button
                type="button"
                onClick={onOpenPocket}
                className="group/pocket inline-flex items-center gap-1.5 text-[10.5px] font-medium text-neutral-400 transition-colors hover:text-neutral-800"
              >
                {formatThoughtCount(previousCount)}

                <ArrowUpRight
                  size={12}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover/pocket:-translate-y-px group-hover/pocket:translate-x-px"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================================================== */
/* MEMORY POCKET */
/* ===================================================== */

function MemoryPocket({
  name,
  messages,
  currentUserId,
  onClose,
}: {
  name: string
  messages: DebateMessage[]
  currentUserId: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-neutral-950/20 p-2.5 backdrop-blur-[3px] xs:p-3 sm:items-center sm:p-6">
      <div className="relative flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-[1.6rem] border border-black/[0.06] bg-[#faf9f6] shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:max-h-[80vh] sm:rounded-[2rem]">
        <div className="absolute -right-20 -top-20 size-48 rounded-full bg-pink-300/[0.08] blur-[70px]" />

        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-black/[0.05] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
              Memory pocket
            </p>

            <h2 className="mt-1 truncate  text-[18px] tracking-[-0.02em] text-neutral-900 sm:text-[20px]">
              {name}&apos;s thoughts
            </h2>

            <p className="mt-1 text-[10px] text-neutral-400">
              {formatThoughtCount(messages.length)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-white text-neutral-400 transition hover:bg-neutral-900 hover:text-white sm:size-9"
            aria-label="Close memory pocket"
          >
            <X size={13} strokeWidth={1.7} />
          </button>
        </header>

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 sm:px-7 sm:py-5">
          <div className="space-y-1">
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1]

              const showDateSeparator =
                index === 0 ||
                !previousMessage ||
                !isSameDay(
                  message.created_at,
                  previousMessage.created_at,
                )

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <DateSeparator date={message.created_at} />
                  )}

                  <DebateMessageBubble
                    message={message}
                    currentUserId={currentUserId}
                    variant="history"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================================================== */
/* MAIN */
/* ===================================================== */

export default function DebateRoom({
  debateId,
  relationshipId,
  currentUserId,
  members,
}: DebateRoomProps) {
  const [showIntro, setShowIntro] = useState(true)

  const [isConfirmingResolve, setIsConfirmingResolve] =
    useState(false)

  const [openPocket, setOpenPocket] = useState<
    string | null
  >(null)

  /* partner yang dipilih manual lewat klik avatar (null = ikuti pengirim terakhir) */
  const [focusedPartnerId, setFocusedPartnerId] =
    useState<string | null>(null)

  const [showAiMemory, setShowAiMemory] = useState(false)
  const [showAiOverlay, setShowAiOverlay] = useState(false)
  const [aiOverlayMessageId, setAiOverlayMessageId] =
    useState<string | null>(null)

  const { data: debate } = useDebate(debateId)

  const { data: messages, isLoading } =
    useDebateMessages(debateId)

  const resolveDebateMutation =
    useResolveDebate(relationshipId)

  useAutoFinalVerdict(debateId)

  const isAiProcessingStale =
    !!debate?.ai_processing_started_at &&
    Date.now() - new Date(debate.ai_processing_started_at).getTime() > 60_000

  const isAiProcessing =
    Boolean(debate?.ai_processing_requested_by) && !isAiProcessingStale

  const aiMessages = messages?.filter((m) => m.role === 'ai') ?? []

  const latestAiMessage = aiMessages.at(-1)

  const finalVerdictMessage = messages
    ?.filter((m) => m.role === 'ai' && m.is_final_verdict)
    .at(-1)

  const latestUserMessageId = messages
    ?.filter((m) => m.role === 'user')
    .at(-1)?.id

  useEffect(() => {
    if (isAiProcessing) {
      setShowAiOverlay(true)
      setAiOverlayMessageId(null)
    }
  }, [isAiProcessing])

  useEffect(() => {
    if (!isAiProcessing && latestAiMessage) {
      setAiOverlayMessageId(latestAiMessage.id)
    }
  }, [isAiProcessing, latestAiMessage?.id])

  useEffect(() => {
    if (finalVerdictMessage) {
      setAiOverlayMessageId(finalVerdictMessage.id)
    }
  }, [finalVerdictMessage?.id])

  /* ada pesan baru -> balon otomatis kembali mengikuti pengirim terbaru */
  useEffect(() => {
    setFocusedPartnerId(null)
  }, [latestUserMessageId])

  if (!debate) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          size={18}
          className="animate-spin text-neutral-300"
        />
      </div>
    )
  }

  const isRoomActive = debate.status === 'active'

  const isPendingVerdict =
    debate.status === 'pending_verdict'

  const aiRequester = isAiProcessing
    ? members.find(
      (member) =>
        member.user_id ===
        debate.ai_processing_requested_by,
    )
    : null

  const aiRequesterName =
    aiRequester?.display_name ??
    aiRequester?.username ??
    null

  const isAiRequestedByMe =
    debate.ai_processing_requested_by === currentUserId

  const userMessages =
    messages?.filter(
      (message) => message.role === 'user',
    ) ?? []

  const userMessageCount = userMessages.length

  const latestUserMessages = userMessages.reduce(
    (acc, message) => {
      if (!message.sender_id) {
        return acc
      }

      const existing = acc.get(message.sender_id)

      if (
        !existing ||
        new Date(message.created_at).getTime() >
        new Date(existing.created_at).getTime()
      ) {
        acc.set(message.sender_id, message)
      }

      return acc
    },
    new Map<string, DebateMessage>(),
  )

  const sortedMembers = [...members]

  const currentMember =
    sortedMembers.find(
      (member) => member.user_id === currentUserId,
    ) ?? sortedMembers[0]

  const otherMember =
    sortedMembers.find(
      (member) => member.user_id !== currentUserId,
    ) ?? sortedMembers[1]

  const partnerA = currentMember ?? {
    user_id: currentUserId,
    display_name: 'You',
    username: null,
  }

  const partnerB = otherMember ?? {
    user_id: 'partner',
    display_name: 'Partner',
    username: null,
  }

  const partnerAName = getMemberName(partnerA)
  const partnerBName = getMemberName(partnerB)

  const partnerAMessages = userMessages
    .filter(
      (message) => message.sender_id === partnerA.user_id,
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )

  const partnerBMessages = userMessages
    .filter(
      (message) => message.sender_id === partnerB.user_id,
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )

  const latestPartnerAMessage = latestUserMessages.get(
    partnerA.user_id,
  )

  const latestPartnerBMessage = latestUserMessages.get(
    partnerB.user_id,
  )

  const previousPartnerAMessages =
    partnerAMessages.slice(0, -1)

  const previousPartnerBMessages =
    partnerBMessages.slice(0, -1)

  const latestAiCommentMessage = messages
    ?.filter(
      (message) =>
        message.role === 'ai' && !message.is_final_verdict,
    )
    .at(-1)

  const lastUserMessage = userMessages.at(-1)

  const aiMemoryMessages = [...aiMessages].reverse()

  const overlayMessage =
    messages?.find(
      (message) =>
        message.id === aiOverlayMessageId,
    ) ?? latestAiMessage

  const hasNewMessageSinceLastAiComment =
    !latestAiCommentMessage ||
    !lastUserMessage ||
    new Date(lastUserMessage.created_at) >
    new Date(latestAiCommentMessage.created_at)

  const hasUserMessage = userMessageCount > 0

  const canRequestAiComment =
    hasUserMessage &&
    hasNewMessageSinceLastAiComment &&
    !isAiProcessing

  const status = statusConfig[debate.status]

  /* ---------- single active bubble ---------- */

  const hasMessages = Boolean(messages?.length)

  const activePartnerId =
    focusedPartnerId ??
    lastUserMessage?.sender_id ??
    partnerA.user_id

  const activeSide: Side =
    activePartnerId === partnerB.user_id
      ? 'right'
      : 'left'

  const activeMessage =
    activeSide === 'left'
      ? latestPartnerAMessage
      : latestPartnerBMessage

  const activePreviousCount =
    activeSide === 'left'
      ? previousPartnerAMessages.length
      : previousPartnerBMessages.length

  const activeDisplayName =
    activeSide === 'left' ? 'You' : partnerBName

  const activeEmptyText =
    activeSide === 'left'
      ? "You haven't shared a thought yet."
      : `${partnerBName} hasn't shared a thought yet.`

  const handleResolve = () => {
    if (!isConfirmingResolve) {
      setIsConfirmingResolve(true)
      return
    }

    setShowAiOverlay(true)
    setAiOverlayMessageId(null)

    resolveDebateMutation.mutate(debateId, {
      onError: (error) => {
        alert(error.message)
        setIsConfirmingResolve(false)
        setShowAiOverlay(false)
      },
    })
  }

  const pocketMessages =
    openPocket === partnerA.user_id
      ? previousPartnerAMessages
      : openPocket === partnerB.user_id
        ? previousPartnerBMessages
        : []

  const pocketName =
    openPocket === partnerA.user_id
      ? partnerAName
      : partnerBName

  return (
    <>
      {showIntro && (
        <DebateIntro
          title={debate.title}
          partnerAName={partnerAName}
          partnerBName={partnerBName}
          partnerAAvatarUrl={partnerA.avatar_url}
          partnerBAvatarUrl={partnerB.avatar_url}
          personaName={personaLabel[debate.ai_persona].text}
          personaImage={personaLabel[debate.ai_persona].image}
          onComplete={() => setShowIntro(false)}
        />
      )}

      <style jsx global>{`
        @keyframes debate-ai-pulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes debate-content-in {
          from {
            opacity: 0;
            transform: translate3d(var(--from-x, 0px), 6px, 0);
            filter: blur(5px);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }
      `}</style>

      {/* ROOM SHELL */}

      <div className="fixed inset-0 z-20 flex flex-col overflow-hidden">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-black/[0.055] bg-white shadow-[0_28px_90px_-45px_rgba(0,0,0,0.22)] sm:rounded-[2rem] md:rounded-[2.4rem]">
          
          {/* HEADER */}
          <header className="relative z-30 flex min-h-[60px] shrink-0 items-center justify-between gap-3 border-b border-black/[0.045] px-3.5 py-3 sm:min-h-[68px] sm:px-7 sm:py-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <Link
                href="/debates"
                aria-label="Back to discussions"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/70 text-neutral-400 transition-all hover:bg-neutral-900 hover:text-white"
              >
                <ArrowLeft size={13} strokeWidth={1.8} />
              </Link>

              <div className="min-w-0">
                <p className="max-w-[calc(100vw-130px)] truncate  text-[15px] tracking-[-0.015em] text-neutral-900 sm:max-w-none sm:text-[16px]">
                  {debate.title}
                </p>
              </div>
            </div>

            {/* RESOLVE */}

            {isRoomActive && hasUserMessage && (
              <div className="shrink-0">
                {isConfirmingResolve ? (
                  <div className="flex items-center gap-1 rounded-full border border-black/[0.055] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
                    <button
                      type="button"
                      onClick={handleResolve}
                      disabled={
                        resolveDebateMutation.isPending
                      }
                      className="rounded-full bg-neutral-900 px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-black disabled:opacity-50 sm:px-3.5"
                    >
                      Yes, resolve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsConfirmingResolve(false)
                      }
                      className="rounded-full px-2.5 py-1.5 text-[10px] font-medium text-neutral-500 transition hover:bg-neutral-50 sm:px-3"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={isAiProcessing}
                    className="rounded-full px-2.5 py-1.5 text-[10px] font-medium text-neutral-400 transition hover:bg-white hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3"
                  >
                    <span className="sm:hidden">End</span>

                    <span className="hidden sm:inline">
                      End discussion
                    </span>
                  </button>
                )}
              </div>
            )}
          </header>

          {/* STAGE */}

          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-8 sm:px-7 sm:py-10">
            {isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2
                  size={18}
                  className="animate-spin text-neutral-300"
                />
              </div>
            ) : (
              <div className="mx-auto flex min-h-full w-full max-w-[520px] flex-col justify-center">
                {/* 1. DUORA AI */}

                <MediatorStage
                  persona={personaLabel[debate.ai_persona]}
                  isProcessing={isAiProcessing}
                  hasAiComment={Boolean(
                    latestAiCommentMessage,
                  )}
                  isPendingVerdict={isPendingVerdict}
                  onOpenHistory={() => setShowAiMemory(true)}
                />

                {/* 2. PARTNERS (satu baris) */}

                <div
                  role="group"
                  aria-label="Switch between partners"
                  className="relative mt-6"
                >
                  {/* konektor AI -> pasangan */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 left-1/2 h-[calc(1.5rem_+_34px)] w-px -translate-x-1/2 bg-gradient-to-b from-black/[0.03] to-black/[0.12] sm:h-[calc(1.5rem_+_38px)]"
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[calc(25%_+_50px)] right-[calc(25%_+_50px)] top-[34px] h-px bg-gradient-to-r from-black/[0.12] via-black/[0.05] to-black/[0.12] sm:top-[38px]"
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[34px] size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-300 sm:top-[38px]"
                  />

                  <div className="relative grid grid-cols-2">
                    <PartnerAvatar
                      name="You"
                      image={lembutAi}
                      avatarUrl={partnerA.avatar_url}
                      side="left"
                      isActive={
                        hasMessages && activeSide === 'left'
                      }
                      isDimmed={
                        hasMessages && activeSide !== 'left'
                      }
                      disabled={!hasMessages}
                      onSelect={() =>
                        setFocusedPartnerId(partnerA.user_id)
                      }
                    />

                    <PartnerAvatar
                      name={partnerBName}
                      image={formalAi}
                      avatarUrl={partnerB.avatar_url}
                      side="right"
                      isActive={
                        hasMessages && activeSide === 'right'
                      }
                      isDimmed={
                        hasMessages && activeSide !== 'right'
                      }
                      disabled={!hasMessages}
                      onSelect={() =>
                        setFocusedPartnerId(partnerB.user_id)
                      }
                    />
                  </div>
                </div>

                {/* 3. SINGLE ACTIVE BUBBLE */}

                <div className="mt-8">
                  {hasMessages ? (
                    <>
                      <ActiveBubble
                        side={activeSide}
                        name={activeDisplayName}
                        message={activeMessage}
                        previousCount={activePreviousCount}
                        emptyText={activeEmptyText}
                        onOpenPocket={() =>
                          setOpenPocket(
                            activeSide === 'left'
                              ? partnerA.user_id
                              : partnerB.user_id,
                          )
                        }
                      />

                      <p className="mt-5 text-center text-xs tracking-[0.02em] text-neutral-300">
                        Tap avatar untuk melihat obrolan
                      </p>
                    </>
                  ) : (
                    <div className="px-4 text-center">
                      <h2 className=" text-[26px] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[30px]">
                        Start with what you feel.
                      </h2>

                      <p className="mx-auto mt-3 max-w-[300px] text-[12px] leading-6 text-neutral-400">
                        There is no need to be right here.
                        Just say what is on your mind.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* AI ERROR + COMPOSER */}

          <DebateComposer
            debateId={debateId}
            isRoomActive={isRoomActive}
            isPendingVerdict={isPendingVerdict}
            isAiProcessing={isAiProcessing}
            isAiRequestedByMe={isAiRequestedByMe}
            aiRequesterName={aiRequesterName}
            userMessageCount={userMessageCount}
            maxMessages={debate.max_messages}
            hasUserMessage={hasUserMessage}
            hasNewMessageSinceLastAiComment={
              hasNewMessageSinceLastAiComment
            }
            canRequestAiComment={canRequestAiComment}
          />
        </div>
      </div>

      {/* MEMORY OVERLAY */}

      {openPocket && pocketMessages.length > 0 && (
        <MemoryPocket
          name={pocketName}
          messages={pocketMessages}
          currentUserId={currentUserId}
          onClose={() => setOpenPocket(null)}
        />
      )}

      {showAiMemory && aiMemoryMessages.length > 0 && (
        <AiMemoryPocket
          messages={aiMemoryMessages}
          onClose={() => setShowAiMemory(false)}
        />
      )}

      {showAiOverlay && (
        <AiResponseOverlay
          message={overlayMessage}
          isProcessing={isAiProcessing}
          isPendingVerdict={isPendingVerdict}
          personaName={
            personaLabel[debate.ai_persona].text
          }
          personaImage={
            personaLabel[debate.ai_persona].image
          }
          requesterName={aiRequesterName}
          onClose={() => {
            setShowAiOverlay(false)
            setAiOverlayMessageId(null)
          }}
        />
      )}
    </>
  )
}