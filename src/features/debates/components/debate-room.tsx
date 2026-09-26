'use client'

import {
  useState,
  type ComponentProps,
} from 'react'
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import DebateMessageBubble from './debate-message-bubble'
import DateSeparator from './date-separator'

import {
  useAutoFinalVerdict,
  useDebate,
  useDebateMessages,
  useRequestAiAnalysis,
  useResolveDebate,
  useSendDebateMessage,
} from '../queries'
import { AiPersona } from '../types'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import DebateIntro from './debate-intro'

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
    image: typeof happyEmot
  }
> = {
  formal: {
    text: 'Formal',
    image: neutralEmot,
  },
  lembut: {
    text: 'Lembut',
    image: happyEmot,
  },
  kasar: {
    text: 'Nyeletuk',
    image: stressedEmot,
  },
  lebay: {
    text: 'Lebay',
    image: tiredEmot,
  },
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
  return `${count} ${count === 1 ? 'previous thought' : 'previous thoughts'}`
}

/* ===================================================== */
/* CHARACTER */
/* ===================================================== */

function PartnerCharacter({
  name,
  image,
  avatarUrl,
  latestMessage,
  previousCount,
  side,
  onPocketClick,
  isActive,
}: {
  name: string
  image: typeof happyEmot
  avatarUrl?: string | null
  latestMessage?: {
    content: string
    created_at: string
  }
  previousCount: number
  side: 'left' | 'right'
  onPocketClick: () => void
  isActive: boolean
}) {
  const isLeft = side === 'left'

  return (
    <section
      className={[
        'relative flex min-w-0 w-full flex-col items-center',
        'md:items-center',
        isLeft ? 'md:items-end' : 'md:items-start',
      ].join(' ')}
    >
      {/* NAME */}

      <div
        className={[
          'mb-3 flex max-w-full items-center gap-2 sm:mb-4',
          isLeft
            ? 'md:flex-row-reverse'
            : 'md:flex-row',
        ].join(' ')}
      >
        <span className="max-w-[180px] truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[10px] sm:tracking-[0.16em]">
          {name}
        </span>
      </div>

      {/* CHARACTER */}

      <div className="relative">
        <div
          className={[
            'absolute -inset-4 rounded-full blur-3xl transition-all duration-700 sm:-inset-5',
            isLeft
              ? 'bg-pink-300/[0.16]'
              : 'bg-blue-300/[0.15]',
            isActive
              ? 'scale-110 opacity-100'
              : 'scale-90 opacity-50',
          ].join(' ')}
        />

        <div
          className={[
            'relative flex size-[78px] items-center justify-center rounded-full border border-black/[0.045] bg-white shadow-[0_16px_35px_rgba(0,0,0,0.07)]',
            'xs:size-[86px] sm:size-[108px]',
            isActive
              ? 'animate-[debate-breathe_4s_ease-in-out_infinite]'
              : '',
          ].join(' ')}
        >
          <div className="absolute inset-[4px] rounded-full bg-[#f8f7f3] sm:inset-[5px]" />

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="relative z-10 size-[70px] rounded-full object-cover xs:size-[78px] sm:size-[98px]"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              width={82}
              height={82}
              className="relative z-10 size-[60px] object-contain xs:size-[66px] sm:size-[82px]"
            />
          )}
        </div>

        {/* MEMORY POCKET */}

        <button
          type="button"
          onClick={onPocketClick}
          disabled={previousCount === 0}
          aria-label={`Open ${name}'s previous thoughts`}
          className={[
            'group absolute -bottom-3 flex min-w-[62px] items-center justify-center gap-1 rounded-[1rem] border border-black/[0.06] bg-white px-2.5 py-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.07)] transition-all duration-300 sm:-bottom-4 sm:min-w-[68px] sm:gap-1.5 sm:rounded-[1.2rem] sm:px-3 sm:py-2',
            isLeft
              ? '-right-3 sm:-right-4'
              : '-left-3 sm:-left-4',
            previousCount > 0
              ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.1)]'
              : 'cursor-default opacity-45',
          ].join(' ')}
        >
          <span className="text-[11px] font-semibold tracking-[-0.03em] text-neutral-800 sm:text-[12px]">
            {previousCount}
          </span>

          <span className="text-[7px] font-medium uppercase tracking-[0.1em] text-neutral-400 sm:text-[8px] sm:tracking-[0.12em]">
            saved
          </span>
        </button>
      </div>

      {/* LATEST THOUGHT */}

      <div
        className={[
          'mt-10 w-full max-w-[310px] px-1 sm:mt-12 sm:px-0',
          isLeft
            ? 'md:mr-0 md:ml-auto'
            : 'md:ml-0 md:mr-auto',
        ].join(' ')}
      >
        {latestMessage ? (
          <div
            className={[
              'relative overflow-hidden rounded-[1.45rem] border border-black/[0.055] bg-white px-4 py-3.5 shadow-[0_15px_45px_rgba(0,0,0,0.045)] transition-all duration-500 sm:rounded-[1.7rem] sm:px-5 sm:py-4',
              isActive
                ? 'translate-y-0 opacity-100'
                : 'opacity-90',
            ].join(' ')}
          >
            <div
              className={[
                'absolute top-0 h-[2px] w-10 rounded-full sm:w-12',
                isLeft
                  ? 'left-4 bg-pink-300/60 sm:left-5'
                  : 'right-4 bg-blue-300/60 sm:right-5',
              ].join(' ')}
            />

            <p className="whitespace-pre-line break-words text-[12px] leading-[1.65] tracking-[-0.008em] text-neutral-700 sm:text-[12.5px] sm:leading-[1.7]">
              {latestMessage.content}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="truncate text-[7px] font-semibold uppercase tracking-[0.12em] text-neutral-300 sm:text-[8px] sm:tracking-[0.14em]">
                Latest thought
              </span>

              <span className="shrink-0 text-[7px] text-neutral-300 sm:text-[8px]">
                {new Date(
                  latestMessage.created_at,
                ).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.45rem] border border-dashed border-black/[0.07] bg-white/45 px-4 py-4 text-center sm:rounded-[1.7rem] sm:px-5 sm:py-5">
            <p className="text-[9px] leading-5 text-neutral-300 sm:text-[10px]">
              Waiting for their first thought.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ===================================================== */
/* AI MEDIATOR CENTER */
/* ===================================================== */

function MediatorStage({
  persona,
  isProcessing,
  hasAiComment,
  isPendingVerdict,
  latestAiMessage,
  onOpenHistory,
}: {
  persona: {
    text: string
    image: typeof happyEmot
  }
  isProcessing: boolean
  hasAiComment: boolean
  isPendingVerdict: boolean
  latestAiMessage?: DebateMessage
  onOpenHistory: () => void
}) {
  const active =
    isProcessing ||
    isPendingVerdict ||
    Boolean(latestAiMessage)

  return (
    <section className="relative flex min-w-0 w-full flex-col items-center justify-center">
      <div
        className={[
          'pointer-events-none absolute left-1/2 top-1/2 size-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] transition-all duration-1000 sm:size-[190px] sm:blur-[70px]',
          active
            ? 'scale-110 bg-[#eadfd2]/70'
            : 'scale-90 bg-[#eee9e1]/45',
        ].join(' ')}
      />

      {/* CONNECTION LINE */}

      <div className="pointer-events-none absolute left-1/2 top-[78px] hidden h-px w-[calc(100%+150px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/[0.06] to-transparent md:block" />

      {/* AI OBJECT */}

      <button
        type="button"
        onClick={onOpenHistory}
        className="group relative z-10 flex flex-col items-center"
      >
        <div
          className={[
            'relative flex size-[68px] items-center justify-center rounded-full border border-black/[0.055] bg-[#f8f4ed] shadow-[0_18px_55px_rgba(0,0,0,0.09)] transition-all duration-700 sm:size-[86px]',
            isProcessing
              ? 'scale-110'
              : 'group-hover:scale-105',
          ].join(' ')}
        >
          <div
            className={[
              'absolute -inset-2 rounded-full border border-black/[0.035] transition-all duration-700',
              isProcessing
                ? 'scale-110 opacity-100'
                : 'scale-95 opacity-50',
            ].join(' ')}
          />

          <div
            className={[
              'absolute inset-2.5 rounded-full bg-white/80 sm:inset-3',
              isProcessing
                ? 'animate-[debate-ai-pulse_1.8s_ease-in-out_infinite]'
                : '',
            ].join(' ')}
          />

          <p className='text-black text-2xl'>✦</p>
        </div>

        <div className="mt-3 text-center sm:mt-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-[9px] sm:tracking-[0.18em]">
            Duora AI
          </p>

          <p className="mt-1 max-w-[180px] text-[9px] leading-4 text-neutral-300 sm:text-[10px]">
            {isProcessing
              ? isPendingVerdict
                ? 'Finding common ground'
                : 'Listening to both sides'
              : hasAiComment
                ? 'Mediator'
                : 'Here if needed'}
          </p>
        </div>
      </button>

      {/* AI RESPONSE */}

      {latestAiMessage && !isProcessing && (
        <div className="relative z-10 mt-7 w-full max-w-[370px] sm:mt-8">
          <DebateMessageBubble
            message={latestAiMessage}
            currentUserId=""
            variant="mediator"
          />
        </div>
      )}

      {/* PROCESSING STATE */}

      {isProcessing && (
        <div className="relative z-10 mt-6 flex flex-col items-center sm:mt-7">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-neutral-300" />
            <span className="size-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:300ms]" />
          </div>

          <p className="mt-2 text-[8px] text-neutral-300 sm:text-[9px]">
            {isPendingVerdict
              ? 'Preparing the resolution'
              : 'Reading both perspectives'}
          </p>
        </div>
      )}

      {/* PERSONA */}

      <div className="mt-4 flex max-w-[calc(100vw-48px)] items-center gap-1.5 rounded-full border border-black/[0.045] bg-white/70 px-2.5 py-1 sm:mt-5">
        <Image
          src={persona.image}
          alt={persona.text}
          width={17}
          height={17}
          className="size-4 shrink-0 object-contain"
        />

        <span className="truncate text-[8px] font-medium text-neutral-400 sm:text-[8.5px]">
          {persona.text} mediator
        </span>
      </div>
    </section>
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
            <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-neutral-300 sm:text-[8px] sm:tracking-[0.18em]">
              Memory pocket
            </p>

            <h2 className="mt-1 truncate text-[16px] font-semibold tracking-[-0.04em] text-neutral-900 sm:text-[18px]">
              {name}'s thoughts
            </h2>

            <p className="mt-1 text-[9px] text-neutral-400 sm:text-[10px]">
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
              const previousMessage =
                messages[index - 1]

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
                    <DateSeparator
                      date={message.created_at}
                    />
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
/* RESOLUTION */
/* ===================================================== */

function ResolutionScene({
  message,
}: {
  message: DebateMessage
}) {
  return (
    <div className="relative z-10 mt-8 w-full sm:mt-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex flex-col items-center text-center sm:mb-5">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-black/[0.055] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.07)] sm:size-14">
            <div className="absolute -inset-2 rounded-full bg-[#eee5d9]/50 blur-xl" />

            <span className="relative text-lg text-neutral-500 sm:text-xl">
              ♡
            </span>
          </div>

          <p className="mt-3 text-[7px] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:mt-4 sm:text-[8px] sm:tracking-[0.2em]">
            Duora
          </p>

          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.045em] text-neutral-900 sm:text-[22px]">
            Resolution
          </h2>

          <p className="mt-1 max-w-[280px] text-[9px] leading-4 text-neutral-400 sm:text-[10px]">
            A calmer place to meet in the middle.
          </p>
        </div>

        <DebateMessageBubble
          message={message}
          currentUserId=""
          variant="resolution"
        />
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
  const [input, setInput] = useState('')
  const [showIntro, setShowIntro] = useState(true)

  const [selectedProvider, setSelectedProvider] =
    useState<'auto' | 'openrouter' | 'groq'>('auto')

  const [lastAiError, setLastAiError] = useState<{
    mode: 'comment' | 'final_verdict'
    provider?: 'openrouter' | 'groq'
  } | null>(null)

  const [isConfirmingResolve, setIsConfirmingResolve] =
    useState(false)

  const [openPocket, setOpenPocket] = useState<
    string | null
  >(null)

  const { data: debate } = useDebate(debateId)

  const {
    data: messages,
    isLoading,
  } = useDebateMessages(debateId)

  const sendMessageMutation =
    useSendDebateMessage(debateId)

  const requestAiMutation =
    useRequestAiAnalysis(debateId)

  const resolveDebateMutation =
    useResolveDebate(relationshipId)

  useAutoFinalVerdict(debateId)

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

  const isAiProcessingStale =
    debate.ai_processing_started_at &&
    Date.now() -
    new Date(
      debate.ai_processing_started_at,
    ).getTime() >
    60_000

  const isAiProcessing =
    Boolean(debate.ai_processing_requested_by) &&
    !isAiProcessingStale

  const aiRequestedByName = isAiProcessing
    ? members.find(
      (member) =>
        member.user_id ===
        debate.ai_processing_requested_by,
    )
    : null

  const isAiRequestedByMe =
    debate.ai_processing_requested_by ===
    currentUserId

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
      (member) =>
        member.user_id === currentUserId,
    ) ?? sortedMembers[0]

  const otherMember =
    sortedMembers.find(
      (member) =>
        member.user_id !== currentUserId,
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
      (message) =>
        message.sender_id ===
        partnerA.user_id,
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )

  const partnerBMessages = userMessages
    .filter(
      (message) =>
        message.sender_id ===
        partnerB.user_id,
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
    )

  const latestPartnerAMessage =
    latestUserMessages.get(
      partnerA.user_id,
    )

  const latestPartnerBMessage =
    latestUserMessages.get(
      partnerB.user_id,
    )

  const previousPartnerAMessages =
    partnerAMessages.slice(0, -1)

  const previousPartnerBMessages =
    partnerBMessages.slice(0, -1)

  const latestAiCommentMessage = messages
    ?.filter(
      (message) =>
        message.role === 'ai' &&
        !message.is_final_verdict,
    )
    .at(-1)

  const finalVerdictMessage = messages
    ?.filter(
      (message) =>
        message.role === 'ai' &&
        message.is_final_verdict,
    )
    .at(-1)

  const lastUserMessage = userMessages.at(-1)

  const hasNewMessageSinceLastAiComment =
    !latestAiCommentMessage ||
    !lastUserMessage ||
    new Date(lastUserMessage.created_at) >
    new Date(
      latestAiCommentMessage.created_at,
    )

  const hasUserMessage = userMessageCount > 0

  const canRequestAiComment =
    hasUserMessage &&
    hasNewMessageSinceLastAiComment &&
    !isAiProcessing

  const status = statusConfig[debate.status]

  const handleSend = () => {
    if (
      !input.trim() ||
      !isRoomActive ||
      isAiProcessing
    ) {
      return
    }

    sendMessageMutation.mutate(
      {
        debateId,
        content: input.trim(),
      },
      {
        onSuccess: () => {
          setInput('')
          setLastAiError(null)
        },
      },
    )
  }

  const handleResolve = () => {
    if (!isConfirmingResolve) {
      setIsConfirmingResolve(true)
      return
    }

    resolveDebateMutation.mutate(debateId, {
      onError: (error) => {
        alert(error.message)
        setIsConfirmingResolve(false)
      },
    })
  }

  const handleRequestAiComment = () => {
    const providerParam =
      selectedProvider === 'auto'
        ? undefined
        : selectedProvider

    setLastAiError(null)

    requestAiMutation.mutate(
      {
        debateId,
        mode: 'comment',
        provider: providerParam,
      },
      {
        onError: () => {
          setLastAiError({
            mode: 'comment',
            provider: providerParam,
          })
        },
      },
    )
  }

  const handleRetryAiComment = () => {
    if (!lastAiError) return

    setLastAiError(null)

    requestAiMutation.mutate(
      {
        debateId,
        mode: lastAiError.mode,
        provider: lastAiError.provider,
      },
      {
        onError: () => {
          setLastAiError(lastAiError)
        },
      },
    )
  }

  const getAiButtonTooltip = () => {
    if (isAiProcessing) {
      return isAiRequestedByMe
        ? 'Waiting for AI response...'
        : `${aiRequestedByName?.display_name ?? aiRequestedByName?.username ?? 'Your babe'} is requesting AI assistance`
    }

    if (!hasUserMessage) {
      return 'Send a message before requesting AI'
    }

    if (!hasNewMessageSinceLastAiComment) {
      return 'Send a new message before requesting another AI comment'
    }

    return undefined
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
          onComplete={() => setShowIntro(false)}
        />
      )}

      <style jsx global>{`
        @keyframes debate-breathe {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.015);
          }
        }

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
      `}</style>

      {/* ================================================= */}
      {/* ROOM SHELL */}
      {/* ================================================= */}

      <div
        className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#f7f6f2] p-2 xs:p-2.5 sm:p-4 md:p-6"
      >
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-black/[0.055] bg-[#faf9f6] shadow-[0_28px_90px_-45px_rgba(0,0,0,0.22)] sm:rounded-[2rem] md:rounded-[2.4rem]"
        >
          {/* AMBIENT */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-pink-300/[0.07] blur-[80px] sm:size-72 sm:blur-[100px]" />

          <div className="pointer-events-none absolute -left-24 top-1/3 size-56 rounded-full bg-blue-300/[0.055] blur-[80px] sm:size-72 sm:blur-[100px]" />

          <div className="pointer-events-none absolute bottom-0 left-1/2 size-56 -translate-x-1/2 rounded-full bg-[#eadfce]/[0.08] blur-[80px] sm:size-72 sm:blur-[100px]" />

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <header className="relative z-30 flex min-h-[60px] shrink-0 items-center justify-between gap-3 border-b border-black/[0.045] px-3.5 py-3 sm:min-h-[68px] sm:px-7 sm:py-4.5">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <Link
                href="/debates"
                aria-label="Back to discussions"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/70 text-neutral-400 transition-all hover:bg-neutral-900 hover:text-white sm:size-8"
              >
                <ArrowLeft
                  size={13}
                  strokeWidth={1.8}
                />
              </Link>

              <div className="min-w-0">
                <p className="max-w-[calc(100vw-130px)] truncate text-[13px] font-semibold tracking-[-0.03em] text-neutral-900 sm:max-w-none sm:text-[14px]">
                  {debate.title}
                </p>

                <div className="mt-1 flex min-w-0 items-center gap-1.5 sm:mt-1.5 sm:gap-2">
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`size-1.5 rounded-full ${status.color}`}
                    />

                    <span className="text-[8px] font-medium text-neutral-400 sm:text-[9px]">
                      {status.label}
                    </span>
                  </div>

                  <span className="text-[8px] text-neutral-300 sm:text-[9px]">
                    ·
                  </span>

                  <span className="text-[8px] whitespace-nowrap text-neutral-400 sm:text-[9px]">
                    {userMessageCount}/
                    {debate.max_messages >= 999999
                      ? '∞'
                      : debate.max_messages}
                  </span>

                  <span className="hidden text-[9px] text-neutral-300 sm:inline">
                    ·
                  </span>

                  <span className="hidden items-center gap-1 text-[9px] text-neutral-400 sm:flex">
                    <Image
                      src={
                        personaLabel[
                          debate.ai_persona
                        ].image
                      }
                      alt=""
                      width={15}
                      height={15}
                      className="size-3.5 object-contain"
                    />

                    {
                      personaLabel[
                        debate.ai_persona
                      ].text
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* RESOLVE */}

            {isRoomActive &&
              hasUserMessage && (
                <div className="shrink-0">
                  {isConfirmingResolve ? (
                    <div className="flex items-center gap-1 rounded-full border border-black/[0.055] bg-white p-1 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
                      <button
                        type="button"
                        onClick={handleResolve}
                        disabled={
                          resolveDebateMutation.isPending
                        }
                        className="rounded-full bg-neutral-900 px-2.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-black disabled:opacity-50 sm:px-3.5 sm:text-[10px]"
                      >
                        Yes, resolve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setIsConfirmingResolve(
                            false,
                          )
                        }
                        className="rounded-full px-2.5 py-1.5 text-[9px] font-medium text-neutral-500 transition hover:bg-neutral-50 sm:px-3 sm:text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResolve}
                      disabled={isAiProcessing}
                      className="rounded-full px-2 py-1.5 text-[9px] font-medium text-neutral-400 transition hover:bg-white hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:text-[10px]"
                    >
                      <span className="sm:hidden">
                        End
                      </span>

                      <span className="hidden sm:inline">
                        End discussion
                      </span>
                    </button>
                  )}
                </div>
              )}
          </header>

          {/* ================================================= */}
          {/* STAGE */}
          {/* ================================================= */}

          <main className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3.5 py-6 sm:px-7 sm:py-8 lg:px-10">
            {isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2
                  size={18}
                  className="animate-spin text-neutral-300"
                />
              </div>
            ) : !messages?.length ? (
              <div className="flex min-h-full items-center justify-center px-4">
                <div className="max-w-sm text-center">
                  <h2 className="mt-2 text-[21px] font-semibold tracking-[-0.05em] text-neutral-900 sm:text-[24px]">
                    Start with what you feel.
                  </h2>

                  <p className="mx-auto mt-3 max-w-[280px] text-[11px] leading-5 text-neutral-400 sm:max-w-[300px] sm:text-[11.5px]">
                    There is no need to be right here.
                    Just say what is on your mind.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-6xl">
                <div className="mb-6 text-center sm:mb-8">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:text-[8px] sm:tracking-[0.22em]">
                    two perspectives · one conversation
                  </p>
                </div>

                {/* ================================================= */}
                {/* DESKTOP */}
                {/* ================================================= */}

                <div className="hidden items-start gap-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)_minmax(0,1fr)] lg:gap-12">
                  <PartnerCharacter
                    name='you'
                    image={happyEmot}
                    avatarUrl={partnerA.avatar_url}
                    latestMessage={
                      latestPartnerAMessage
                    }
                    previousCount={
                      previousPartnerAMessages.length
                    }
                    side="left"
                    onPocketClick={() =>
                      setOpenPocket(
                        partnerA.user_id,
                      )
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerA.user_id
                    }
                  />

                  <MediatorStage
                    persona={
                      personaLabel[
                      debate.ai_persona
                      ]
                    }
                    isProcessing={
                      isAiProcessing
                    }
                    hasAiComment={Boolean(
                      latestAiCommentMessage,
                    )}
                    isPendingVerdict={
                      isPendingVerdict
                    }
                    latestAiMessage={
                      latestAiCommentMessage
                    }
                    onOpenHistory={() => { }}
                  />

                  <PartnerCharacter
                    name={partnerBName}
                    image={neutralEmot}
                    avatarUrl={partnerB.avatar_url}
                    latestMessage={
                      latestPartnerBMessage
                    }
                    previousCount={
                      previousPartnerBMessages.length
                    }
                    side="right"
                    onPocketClick={() =>
                      setOpenPocket(
                        partnerB.user_id,
                      )
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerB.user_id
                    }
                  />
                </div>

                {/* ================================================= */}
                {/* MOBILE / TABLET */}
                {/* ================================================= */}

                <div className="mx-auto flex w-full max-w-[430px] flex-col gap-10 md:hidden sm:gap-12">
                  <PartnerCharacter
                    name='you'
                    image={happyEmot}
                    avatarUrl={partnerA.avatar_url}
                    latestMessage={
                      latestPartnerAMessage
                    }
                    previousCount={
                      previousPartnerAMessages.length
                    }
                    side="left"
                    onPocketClick={() =>
                      setOpenPocket(
                        partnerA.user_id,
                      )
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerA.user_id
                    }
                  />

                  <div className="relative py-2 sm:py-3">
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/[0.045] to-transparent" />

                    <MediatorStage
                      persona={
                        personaLabel[
                        debate.ai_persona
                        ]
                      }
                      isProcessing={
                        isAiProcessing
                      }
                      hasAiComment={Boolean(
                        latestAiCommentMessage,
                      )}
                      isPendingVerdict={
                        isPendingVerdict
                      }
                      latestAiMessage={
                        latestAiCommentMessage
                      }
                      onOpenHistory={() => { }}
                    />
                  </div>

                  <PartnerCharacter
                    name={partnerBName}
                    image={neutralEmot}
                    avatarUrl={partnerB.avatar_url}
                    latestMessage={
                      latestPartnerBMessage
                    }
                    previousCount={
                      previousPartnerBMessages.length
                    }
                    side="right"
                    onPocketClick={() =>
                      setOpenPocket(
                        partnerB.user_id,
                      )
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerB.user_id
                    }
                  />
                </div>

                {/* FINAL RESOLUTION */}

                {finalVerdictMessage && (
                  <ResolutionScene
                    message={
                      finalVerdictMessage
                    }
                  />
                )}
              </div>
            )}
          </main>

          {/* ================================================= */}
          {/* AI ERROR */}
          {/* ================================================= */}

          {lastAiError && (
            <div className="relative z-30 shrink-0 border-t border-red-500/[0.08] bg-red-50/70 px-3.5 py-2.5 sm:px-7 sm:py-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <p className="min-w-0 flex-1 truncate text-[9px] leading-5 text-red-500/80 sm:text-[10.5px]">
                  {requestAiMutation.error?.message ??
                    'AI failed to respond.'}
                </p>

                <button
                  type="button"
                  onClick={
                    handleRetryAiComment
                  }
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1.5 text-[9px] font-semibold text-red-500 transition hover:bg-red-100/70 sm:px-2.5 sm:text-[10px]"
                >
                  <RefreshCw
                    size={10}
                    strokeWidth={1.8}
                  />

                  <span className="hidden xs:inline">
                    Try again
                  </span>

                  <span className="xs:hidden">
                    Retry
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* COMPOSER */}
          {/* ================================================= */}

          {isRoomActive ? (
            <div className="relative z-30 shrink-0 border-t border-black/[0.045] bg-[#faf9f6]/95 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
              <div className="mx-auto max-w-4xl">
                {/* AI ACTION */}

                <div className="mb-2 flex items-center justify-between gap-2 px-1 sm:mb-2.5 sm:gap-3">
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={
                        handleRequestAiComment
                      }
                      disabled={
                        requestAiMutation.isPending ||
                        !canRequestAiComment
                      }
                      title={getAiButtonTooltip()}
                      className="group flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-black/[0.055] bg-white px-2.5 text-[9px] font-semibold text-neutral-500 shadow-[0_4px_15px_rgba(0,0,0,0.025)] transition-all hover:-translate-y-0.5 hover:border-black/[0.09] hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-30 sm:px-3 sm:text-[9.5px]"
                    >
                      {requestAiMutation.isPending ||
                        isAiProcessing ? (
                        <Loader2
                          size={11}
                          className="animate-spin"
                        />
                      ) : (
                        <Sparkles
                          size={11}
                          strokeWidth={1.8}
                        />
                      )}

                      <span className="hidden xs:inline">
                        Ask Duora AI
                      </span>

                      <span className="xs:hidden">
                        AI
                      </span>
                    </button>

                    <select
                      value={
                        selectedProvider
                      }
                      onChange={(e) =>
                        setSelectedProvider(
                          e.target
                            .value as
                          | 'auto'
                          | 'openrouter'
                          | 'groq',
                        )
                      }
                      disabled={
                        isAiProcessing
                      }
                      aria-label="AI provider"
                      className="h-8 max-w-[80px] cursor-pointer appearance-none rounded-full border border-black/[0.055] bg-white px-2.5 text-[8px] font-medium text-neutral-400 outline-none transition hover:border-black/[0.09] hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 sm:max-w-none sm:px-3 sm:text-[9px]"
                    >
                      <option value="auto">
                        Auto
                      </option>

                      <option value="openrouter">
                        OpenRouter
                      </option>

                      <option value="groq">
                        Groq
                      </option>
                    </select>
                  </div>

                  <span className="shrink-0 text-[8px] font-medium text-neutral-300 sm:text-[9px]">
                    {userMessageCount}/
                    {debate.max_messages >= 999999
                      ? '∞'
                      : debate.max_messages}
                  </span>
                </div>

                {/* INPUT */}

                <div className="relative flex items-end gap-1.5 rounded-[1.35rem] border border-black/[0.065] bg-white p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.045)] transition-all focus-within:border-black/[0.11] focus-within:shadow-[0_14px_45px_rgba(0,0,0,0.065)] sm:gap-2 sm:rounded-[1.6rem]">
                  <textarea
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey
                      ) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder={
                      isAiProcessing
                        ? 'Waiting for the mediator...'
                        : "Say what's on your mind..."
                    }
                    disabled={
                      isAiProcessing
                    }
                    rows={1}
                    className="max-h-28 min-h-10 min-w-0 flex-1 resize-none border-0 bg-transparent px-2.5 py-2.5 text-[12px] leading-5 text-neutral-900 outline-none placeholder:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-32 sm:px-3 sm:text-[12.5px]"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={
                      !input.trim() ||
                      sendMessageMutation.isPending ||
                      isAiProcessing
                    }
                    aria-label="Share thought"
                    className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] bg-neutral-900 text-white shadow-[0_7px_20px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_10px_25px_rgba(0,0,0,0.16)] disabled:pointer-events-none disabled:opacity-20 sm:rounded-[1.15rem]"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Send
                        size={14}
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {/* CONTEXT */}

                <div className="mt-1.5 flex items-center justify-between gap-3 px-2 sm:mt-2">
                  <p className="hidden text-[8px] text-neutral-300 sm:block sm:text-[8.5px]">
                    Enter to share · Shift + Enter
                    for a new line
                  </p>

                  <p className="text-[7.5px] text-neutral-300 sm:hidden">
                    Enter to share
                  </p>

                  {isAiProcessing && (
                    <p className="min-w-0 truncate text-right text-[7.5px] text-neutral-400 sm:text-[8.5px]">
                      {isAiRequestedByMe
                        ? 'The mediator is listening...'
                        : `${aiRequestedByName?.display_name ?? aiRequestedByName?.username ?? 'Your partner'} invited the mediator`}
                    </p>
                  )}

                  {!isAiProcessing &&
                    hasUserMessage &&
                    !hasNewMessageSinceLastAiComment && (
                      <p className="hidden text-right text-[8.5px] text-neutral-300 sm:block">
                        Share another thought to
                        invite the mediator again.
                      </p>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-30 shrink-0 border-t border-black/[0.045] bg-white/60 px-4 py-3.5 text-center sm:px-5 sm:py-4">
              <p className="text-[9.5px] text-neutral-400 sm:text-[10.5px]">
                {isPendingVerdict
                  ? 'The mediator is preparing your resolution.'
                  : 'This discussion has ended.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MEMORY OVERLAY */}

      {openPocket && pocketMessages.length > 0 && (
        <MemoryPocket
          name={pocketName}
          messages={pocketMessages}
          currentUserId={currentUserId}
          onClose={() =>
            setOpenPocket(null)
          }
        />
      )}
    </>
  )
}