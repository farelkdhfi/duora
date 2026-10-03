'use client'

import {
  useEffect,
  useState,
  type ComponentProps,
} from 'react'
import { ArrowLeft, Loader2, X } from 'lucide-react'
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

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import PartnerCharacter from './partner-character'
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
/* AI MEDIATOR CENTER */
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
    image: typeof happyEmot
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
    <section className="relative flex min-w-0 w-full flex-col items-center justify-center">
      <div
        className={[
          'pointer-events-none absolute left-1/2 top-1/2 size-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] transition-all duration-1000 sm:size-[190px] sm:blur-[70px]',
          active
            ? 'scale-110 bg-[#eadfd2]/70'
            : 'scale-90 bg-[#eee9e1]/45',
        ].join(' ')}
      />

      <div className="pointer-events-none absolute left-1/2 top-[78px] hidden h-px w-[calc(100%+150px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-black/[0.06] to-transparent md:block" />

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

          <p className="relative z-10 text-black text-2xl">
            ✦
          </p>
        </div>

        <div className="mt-3 text-center sm:mt-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-[9px] sm:tracking-[0.18em]">
            Duora AI
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={onOpenHistory}
        className="mt-3 text-[8px] font-medium text-neutral-300 transition hover:text-neutral-600"
      >
        View AI memory
      </button>
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

      {/* ROOM SHELL */}

      <div className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#f7f6f2] p-2 xs:p-2.5 sm:p-4 md:p-6">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-black/[0.055] bg-[#faf9f6] shadow-[0_28px_90px_-45px_rgba(0,0,0,0.22)] sm:rounded-[2rem] md:rounded-[2.4rem]">
          {/* AMBIENT */}

          <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-pink-300/[0.07] blur-[80px] sm:size-72 sm:blur-[100px]" />

          <div className="pointer-events-none absolute -left-24 top-1/3 size-56 rounded-full bg-blue-300/[0.055] blur-[80px] sm:size-72 sm:blur-[100px]" />

          <div className="pointer-events-none absolute bottom-0 left-1/2 size-56 -translate-x-1/2 rounded-full bg-[#eadfce]/[0.08] blur-[80px] sm:size-72 sm:blur-[100px]" />

          {/* HEADER */}

          <header className="relative z-30 flex min-h-[60px] shrink-0 items-center justify-between gap-3 border-b border-black/[0.045] px-3.5 py-3 sm:min-h-[68px] sm:px-7 sm:py-4.5">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <Link
                href="/debates"
                aria-label="Back to discussions"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.055] bg-white/70 text-neutral-400 transition-all hover:bg-neutral-900 hover:text-white sm:size-8"
              >
                <ArrowLeft size={13} strokeWidth={1.8} />
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
                      src={personaLabel[debate.ai_persona].image}
                      alt=""
                      width={15}
                      height={15}
                      className="size-3.5 object-contain"
                    />

                    {personaLabel[debate.ai_persona].text}
                  </span>
                </div>
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
                      className="rounded-full bg-neutral-900 px-2.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-black disabled:opacity-50 sm:px-3.5 sm:text-[10px]"
                    >
                      Yes, resolve
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsConfirmingResolve(false)
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

                {/* DESKTOP */}
                <div className="hidden items-start gap-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(260px,380px)_minmax(0,1fr)] lg:gap-12">
                  <PartnerCharacter
                    name="you"
                    image={happyEmot}
                    avatarUrl={partnerA.avatar_url}
                    latestMessage={latestPartnerAMessage}
                    previousCount={
                      previousPartnerAMessages.length
                    }
                    side="left"
                    onPocketClick={() =>
                      setOpenPocket(partnerA.user_id)
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerA.user_id
                    }
                  />

                  <MediatorStage
                    persona={personaLabel[debate.ai_persona]}
                    isProcessing={isAiProcessing}
                    hasAiComment={Boolean(
                      latestAiCommentMessage,
                    )}
                    isPendingVerdict={isPendingVerdict}
                    onOpenHistory={() => setShowAiMemory(true)}
                  />

                  <PartnerCharacter
                    name={partnerBName}
                    image={neutralEmot}
                    avatarUrl={partnerB.avatar_url}
                    latestMessage={latestPartnerBMessage}
                    previousCount={
                      previousPartnerBMessages.length
                    }
                    side="right"
                    onPocketClick={() =>
                      setOpenPocket(partnerB.user_id)
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerB.user_id
                    }
                  />
                </div>

                {/* MOBILE / TABLET */}

                <div className="mx-auto flex w-full max-w-[430px] flex-col gap-10 md:hidden sm:gap-12">
                  <PartnerCharacter
                    name="you"
                    image={happyEmot}
                    avatarUrl={partnerA.avatar_url}
                    latestMessage={latestPartnerAMessage}
                    previousCount={
                      previousPartnerAMessages.length
                    }
                    side="left"
                    onPocketClick={() =>
                      setOpenPocket(partnerA.user_id)
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerA.user_id
                    }
                  />

                  <div className="relative py-2 sm:py-3">
                    <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/[0.045] to-transparent" />

                    <MediatorStage
                      persona={personaLabel[debate.ai_persona]}
                      isProcessing={isAiProcessing}
                      hasAiComment={Boolean(
                        latestAiCommentMessage,
                      )}
                      isPendingVerdict={isPendingVerdict}
                      onOpenHistory={() => setShowAiMemory(true)}
                    />
                  </div>

                  <PartnerCharacter
                    name={partnerBName}
                    image={neutralEmot}
                    avatarUrl={partnerB.avatar_url}
                    latestMessage={latestPartnerBMessage}
                    previousCount={
                      previousPartnerBMessages.length
                    }
                    side="right"
                    onPocketClick={() =>
                      setOpenPocket(partnerB.user_id)
                    }
                    isActive={
                      lastUserMessage?.sender_id ===
                      partnerB.user_id
                    }
                  />
                </div>

                {/* FINAL RESOLUTION */}

                {/* {finalVerdictMessage && (
                  <ResolutionScene
                    message={finalVerdictMessage}
                  />
                )} */}
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