'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

import DebateMessageBubble from './debate-message-bubble'
import AiTypingIndicator from './ai-typing-indicator'

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
import sadEmot from '@/assets/emoticon/sad-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import Image from 'next/image'
import DateSeparator from './date-separator'

interface DebateRoomProps {
  debateId: string
  relationshipId: string
  currentUserId: string
  members: Array<{
    user_id: string
    display_name: string | null
    username: string | null
  }>
}

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

export default function DebateRoom({
  debateId,
  relationshipId,
  currentUserId,
  members,
}: DebateRoomProps) {
  const [input, setInput] = useState('')

  const [selectedProvider, setSelectedProvider] =
    useState<'auto' | 'openrouter' | 'groq'>('auto')

  const [lastAiError, setLastAiError] = useState<{
    mode: 'comment' | 'final_verdict'
    provider?: 'openrouter' | 'groq'
  } | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

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

  const [isConfirmingResolve, setIsConfirmingResolve] =
    useState(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [
    messages,
    debate?.ai_processing_requested_by,
  ])

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

  function isSameDay(dateA: string, dateB: string) {
    return (
      new Date(dateA).toDateString() ===
      new Date(dateB).toDateString()
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
      (m) =>
        m.user_id ===
        debate.ai_processing_requested_by,
    )
    : null

  const isAiRequestedByMe =
    debate.ai_processing_requested_by ===
    currentUserId

  const userMessageCount =
    messages?.filter((m) => m.role === 'user')
      .length ?? 0

  const hasUserMessage = userMessageCount > 0

  const lastUserMessage = messages
    ?.filter((m) => m.role === 'user')
    .at(-1)

  const lastAiCommentMessage = messages
    ?.filter(
      (m) =>
        m.role === 'ai' && !m.is_final_verdict,
    )
    .at(-1)

  const hasNewMessageSinceLastAiComment =
    !lastAiCommentMessage ||
    !lastUserMessage ||
    new Date(lastUserMessage.created_at) >
    new Date(lastAiCommentMessage.created_at)

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

  return (
    <div
      className="
    fixed
    inset-x-0
    top-[60px]
    bottom-0
    z-20
    flex
    flex-col
    overflow-hidden
    bg-neutral-50
    p-3
    sm:p-4

    md:inset-x-auto
    md:left-65
    md:right-0
    md:top-0
    md:bottom-0
    md:p-6
  "
    >
      <div
        className="
      relative
      flex
      min-h-0
      flex-1
      flex-col
      overflow-hidden
      rounded-[2.25rem]
      border
      border-black/[0.055]
      bg-white
      shadow-[0_24px_80px_-40px_rgba(0,0,0,0.2)]
    "
      >
        {/* subtle ambient lights */}

        <div
          className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          size-56
          rounded-full
          bg-pink-400/[0.045]
          blur-[100px]
        "
        />

        <div
          className="
          pointer-events-none
          absolute
          -left-24
          top-1/3
          size-56
          rounded-full
          bg-blue-400/[0.035]
          blur-[100px]
        "
        />

        {/* HEADER */}

        <header
          className="
          relative
          z-10
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-black/[0.045]
          px-5
          py-4.5
          sm:px-7
        "
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <Link
              href="/debates"
              aria-label="Back to discussions"
              className="
              flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.05]
              bg-neutral-50
              text-neutral-400
              transition-all
              duration-200
              hover:bg-neutral-900
              hover:text-white
            "
            >
              <ArrowLeft
                size={13}
                strokeWidth={1.8}
              />
            </Link>

            <div className="min-w-0">
              <h1
                className="
                truncate
                text-[14px]
                font-semibold
                tracking-[-0.025em]
                text-neutral-900
              "
              >
                {debate.title}
              </h1>

              <div className="mt-1.5 flex min-w-0 items-center gap-2">
                {/* STATUS */}

                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${status.color}`}
                  />

                  <span
                    className="
        text-[9.5px]
        font-medium
        tracking-[-0.005em]
        text-neutral-400
      "
                  >
                    {status.label}

                    {isRoomActive &&
                      ` · ${userMessageCount}/${debate.max_messages}`}
                  </span>
                </div>

                {/* PERSONA */}

                <span
                  className="
      flex
      shrink-0
      items-center
      gap-1
      rounded-full
      border
      border-black/[0.045]
      bg-neutral-50
      px-2
      py-0.5
      text-[9px]
      font-medium
      text-neutral-500
      shadow-[0_2px_8px_rgba(0,0,0,0.025)]
    "
                >
                  <Image
                    src={personaLabel[debate.ai_persona].image}
                    alt={personaLabel[debate.ai_persona].text}
                    width={16}
                    height={16}
                    className="size-4 object-contain"
                  />

                  <span>
                    {personaLabel[debate.ai_persona].text}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {isRoomActive && hasUserMessage && (
            <div className="shrink-0">
              {isConfirmingResolve ? (
                <div
                  className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-black/[0.055]
                  bg-neutral-50
                  p-1
                "
                >
                  <button
                    type="button"
                    onClick={handleResolve}
                    disabled={
                      resolveDebateMutation.isPending
                    }
                    className="
                    rounded-full
                    bg-neutral-900
                    px-3.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-black
                    disabled:opacity-50
                  "
                  >
                    Yes, resolve
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIsConfirmingResolve(false)
                    }
                    className="
                    rounded-full
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-neutral-500
                    transition
                    hover:bg-white
                    hover:text-neutral-800
                  "
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResolve}
                  disabled={isAiProcessing}
                  className="
                  rounded-full
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  tracking-[-0.005em]
                  text-neutral-400
                  transition
                  hover:bg-neutral-50
                  hover:text-neutral-700
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
                >
                  End discuss
                </button>
              )}
            </div>
          )}
        </header>

        {/* MESSAGES */}

        <div
          ref={scrollRef}
          className="
    relative
    z-0
    min-h-0
    flex-1
    overflow-x-hidden
    overflow-y-auto
    overscroll-contain
    py-5
    sm:py-6
  "
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2
                size={17}
                className="animate-spin text-neutral-300"
              />
            </div>
          ) : !messages?.length ? (
            <div
              className="
              flex
              min-h-full
              flex-col
              items-center
              justify-center
              px-6
              py-12
              text-center
            "
            >
              <p
                className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-neutral-300
              "
              >
                AI Mediator
              </p>

              <h3
                className="
                mt-3
                text-[18px]
                font-semibold
                tracking-[-0.035em]
                text-neutral-800
              "
              >
                Start the discussion
              </h3>

              <p
                className="
                mt-2
                max-w-[280px]
                text-[11.5px]
                leading-5
                text-neutral-400
              "
              >
                Share your perspective honestly. AI will help keep the discussion neutral.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const previousMessage = messages[index - 1]

              const showDateSeparator =
                index === 0 ||
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
                  />
                </div>
              )
            })
          )}

          {isAiProcessing && !isPendingVerdict && (
            <AiTypingIndicator />
          )}

          {isPendingVerdict && (
            <AiTypingIndicator isFinalVerdict />
          )}
        </div>

        {/* AI ERROR */}

        {lastAiError && (
          <div
            className="
            relative
            z-10
            border-t
            border-red-500/[0.08]
            bg-red-50/60
            px-5
            py-3
            sm:px-7
          "
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className="
                min-w-0
                truncate
                text-[10.5px]
                leading-5
                text-red-500/80
              "
              >
                {requestAiMutation.error?.message ??
                  'AI failed to respond.'}
              </p>

              <button
                type="button"
                onClick={handleRetryAiComment}
                className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1.5
                text-[10px]
                font-semibold
                text-red-500
                transition
                hover:bg-red-100/70
              "
              >
                <RefreshCw
                  size={10}
                  strokeWidth={1.8}
                />

                Try again
              </button>
            </div>
          </div>
        )}

        {/* COMPOSER */}

        {isRoomActive ? (
          <div
            className="
      relative
      z-10
      border-t
      border-black/[0.045]
      bg-white/95
      px-4
      py-3.5
      backdrop-blur-xl
      sm:px-6
      sm:py-4
    "
          >
            {/* TOOLBAR */}

            <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                {/* AI BUTTON */}

                <button
                  type="button"
                  onClick={handleRequestAiComment}
                  disabled={
                    requestAiMutation.isPending ||
                    !canRequestAiComment
                  }
                  title={getAiButtonTooltip()}
                  className="
            flex
            h-8
            items-center
            gap-1.5
            rounded-full
            border
            border-black/[0.055]
            bg-neutral-50
            px-3
            text-[9.5px]
            font-semibold
            text-neutral-500
            shadow-[0_3px_10px_rgba(0,0,0,0.025)]
            transition-all
            hover:border-black/[0.09]
            hover:bg-white
            hover:text-neutral-800
            hover:shadow-[0_5px_14px_rgba(0,0,0,0.04)]
            disabled:pointer-events-none
            disabled:opacity-30
          "
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

                  <span>Ask AI</span>
                </button>

                {/* PROVIDER */}

                <select
                  value={selectedProvider}
                  onChange={(e) =>
                    setSelectedProvider(
                      e.target.value as
                      | 'auto'
                      | 'openrouter'
                      | 'groq',
                    )
                  }
                  disabled={isAiProcessing}
                  className="
            h-8
            cursor-pointer
            appearance-none
            rounded-full
            border
            border-black/[0.055]
            bg-neutral-50
            px-3
            text-[9px]
            font-medium
            text-neutral-400
            outline-none
            transition
            hover:border-black/[0.09]
            hover:bg-white
            hover:text-neutral-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
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

              {/* MESSAGE COUNT */}

              {isRoomActive && (
                <span
                  className="
            text-[9px]
            font-medium
            text-neutral-300
          "
                >
                  {userMessageCount}/{debate.max_messages}
                </span>
              )}
            </div>

            {/* INPUT */}

            <div
              className="
        flex
        items-end
        gap-2
        rounded-[1.5rem]
        border
        border-black/[0.065]
        bg-neutral-50/80
        p-1.5
        shadow-[0_8px_30px_rgba(0,0,0,0.035)]
        transition-all
        focus-within:border-black/[0.11]
        focus-within:bg-white
        focus-within:shadow-[0_10px_35px_rgba(0,0,0,0.055)]
      "
            >
              {/* TEXTAREA */}

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
                    ? 'Waiting for AI response...'
                    : 'Share your perspective...'
                }
                disabled={isAiProcessing}
                rows={1}
                className="
          max-h-32
          min-h-10
          min-w-0
          flex-1
          resize-none
          border-0
          bg-transparent
          px-2.5
          py-2.5
          text-[12.5px]
          leading-5
          text-neutral-900
          outline-none
          placeholder:text-neutral-300
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
              />

              {/* SEND */}

              <button
                type="button"
                onClick={handleSend}
                disabled={
                  !input.trim() ||
                  sendMessageMutation.isPending ||
                  isAiProcessing
                }
                aria-label="Send message"
                className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-[1.1rem]
          bg-neutral-900
          text-white
          shadow-[0_5px_15px_rgba(0,0,0,0.12)]
          transition-all
          hover:-translate-y-0.5
          hover:bg-black
          hover:shadow-[0_8px_20px_rgba(0,0,0,0.16)]
          disabled:pointer-events-none
          disabled:opacity-25
        "
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

            {isAiProcessing && (
              <p
                className="
          mt-2.5
          px-2
          text-[9.5px]
          leading-4
          text-neutral-400
        "
              >
                {isAiRequestedByMe
                  ? 'Waiting for AI to respond. You can continue once AI is finished.'
                  : `${aiRequestedByName?.display_name ??
                  aiRequestedByName?.username ??
                  'Your babe'} is requesting an AI response.`}
              </p>
            )}

            {!isAiProcessing &&
              hasUserMessage &&
              !hasNewMessageSinceLastAiComment && (
                <p
                  className="
            mt-2.5
            px-2
            text-[9.5px]
            leading-4
            text-neutral-400
          "
                >
                  AI has already responded to your latest
                  message. Send a new message to request
                  another response.
                </p>
              )}
          </div>
        ) : (
          <div
            className="
      border-t
      border-black/[0.045]
      bg-neutral-50/60
      px-5
      py-4
      text-center
    "
          >
            <p className="text-[10.5px] text-neutral-400">
              {isPendingVerdict
                ? 'The discussion is being closed. Waiting for the AI verdict.'
                : 'This discussion has ended.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}