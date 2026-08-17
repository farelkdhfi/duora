'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
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
    label: 'Berlangsung',
    color: 'bg-emerald-400',
  },
  pending_verdict: {
    label: 'Menyusun kesimpulan...',
    color: 'bg-amber-400',
  },
  resolved: {
    label: 'Selesai',
    color: 'bg-neutral-400',
  },
  archived: {
    label: 'Diarsipkan',
    color: 'bg-neutral-300',
  },
}

export default function DebateRoom({
  debateId,
  relationshipId,
  currentUserId,
  members,
}: DebateRoomProps) {
  const [input, setInput] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'openrouter' | 'groq'>('auto')
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

  const resolveDebateMutation = useResolveDebate(
    relationshipId,
  )

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
          size={20}
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
    )
      return

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
        ? 'Menunggu respons AI...'
        : `${aiRequestedByName?.display_name ?? aiRequestedByName?.username ?? 'Pasanganmu'} sedang meminta AI`
    }

    if (!hasUserMessage) {
      return 'Kirim pesan dulu sebelum minta AI'
    }

    if (!hasNewMessageSinceLastAiComment) {
      return 'Kirim pesan baru dulu sebelum minta AI comment lagi'
    }

    return undefined
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_20px_70px_-35px_rgba(0,0,0,0.18)]">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/debates"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 hover:bg-neutral-900 hover:text-white"
          >
            <ArrowLeft size={14} />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-neutral-900">
              {debate.title}
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${status.color}`}
              />

              <span className="text-[10px] font-medium text-neutral-400">
                {status.label}
                {isRoomActive &&
                  ` • ${userMessageCount}/${debate.max_messages} pesan`}
              </span>
            </div>
          </div>
        </div>

        {isRoomActive && hasUserMessage && (
          <div className="shrink-0">
            {isConfirmingResolve ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResolve}
                  disabled={
                    resolveDebateMutation.isPending
                  }
                  className="rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  Ya, selesaikan
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsConfirmingResolve(false)
                  }
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-500 hover:bg-neutral-200"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResolve}
                disabled={isAiProcessing}
                className="flex items-center gap-1.5 rounded-full border border-black/[0.08] px-3.5 py-1.5 text-[11px] font-medium text-neutral-500 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle size={12} />
                Selesaikan
              </button>
            )}
          </div>
        )}
      </div>

      {/* MESSAGES */}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2
              size={18}
              className="animate-spin text-neutral-300"
            />
          </div>
        ) : !messages?.length ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-50">
              <Sparkles
                size={18}
                strokeWidth={1.8}
                className="text-neutral-300"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-neutral-800">
              Mulai diskusinya
            </h3>

            <p className="mt-2 max-w-[240px] text-[12px] leading-5 text-neutral-400">
              Sampaikan sudut pandangmu, lalu minta
              AI mediator ikut menanggapi kapan saja.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <DebateMessageBubble
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        {/* TYPING INDICATOR — sekarang dari state DATABASE, kelihatan di kedua device */}

        {isAiProcessing && !isPendingVerdict && (
          <AiTypingIndicator />
        )}

        {isPendingVerdict && (
          <AiTypingIndicator isFinalVerdict />
        )}
      </div>

      {lastAiError && (
        <div className="flex items-center justify-between gap-3 border-t border-red-100 bg-red-50 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <AlertCircle
              size={14}
              className="shrink-0 text-red-500"
            />

            <p className="min-w-0 truncate text-[11.5px] text-red-600">
              {requestAiMutation.error?.message ??
                'AI gagal merespons. Kedua provider (OpenRouter & Groq) tidak berhasil.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRetryAiComment}
            className="
        flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        bg-red-500
        px-3
        py-1.5
        text-[11px]
        font-semibold
        text-white
        transition
        hover:bg-red-600
      "
          >
            <RefreshCw size={11} />
            Coba lagi
          </button>
        </div>
      )}

      {/* FOOTER */}

      {isRoomActive ? (
        <div className="border-t border-black/[0.05] p-4 sm:p-5">
          <div className="flex items-end gap-2">
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
                h-11
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-3.5
                text-[11px]
                font-medium
                text-blue-600
                transition
                hover:bg-blue-100
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {requestAiMutation.isPending ||
                isAiProcessing ? (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Sparkles size={13} />
              )}
              <span className="hidden sm:inline">
                Minta AI
              </span>
            </button>

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
    h-11
    shrink-0
    rounded-full
    border
    border-black/[0.06]
    bg-white
    px-2.5
    text-[10px]
    font-medium
    text-neutral-500
    outline-none
    disabled:opacity-50
  "
            >
              <option value="auto">Auto</option>
              <option value="openrouter">OpenRouter</option>
              <option value="groq">Groq</option>
            </select>

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
                  ? 'Menunggu AI merespons...'
                  : 'Sampaikan pendapatmu...'
              }
              disabled={isAiProcessing}
              rows={1}
              className="
    max-h-24
    min-h-11
    flex-1
    resize-none
    rounded-2xl
    border
    border-black/[0.06]
    bg-[#f8f8f7]
    px-4
    py-2.5
    text-[13px]
    text-neutral-900
    outline-none
    focus:border-black/[0.12]
    focus:bg-white
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                !input.trim() ||
                sendMessageMutation.isPending ||
                isAiProcessing
              }
              className="
    flex
    size-11
    shrink-0
    items-center
    justify-center
    rounded-full
    bg-neutral-900
    text-white
    transition
    hover:bg-black
    disabled:cursor-not-allowed
    disabled:opacity-40
  "
            >
              {sendMessageMutation.isPending ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>

          {/* KETERANGAN kalau AI sedang diproses (oleh siapapun) */}

          {isAiProcessing && (
            <p className="mt-2 text-[10.5px] text-neutral-400">
              {isAiRequestedByMe
                ? 'Menunggu AI merespons... Kamu bisa kirim pesan lagi setelah AI selesai.'
                : `${aiRequestedByName?.display_name ?? aiRequestedByName?.username ?? 'Pasanganmu'} sedang meminta tanggapan AI, mohon tunggu...`}
            </p>
          )}

          {!isAiProcessing &&
            hasUserMessage &&
            !hasNewMessageSinceLastAiComment && (
              <p className="mt-2 text-[10.5px] text-neutral-400">
                AI sudah menanggapi pesan terakhir. Kirim pesan baru untuk minta tanggapan lagi.
              </p>
            )}
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-black/[0.05] bg-neutral-50 px-5 py-3.5">
          <AlertCircle
            size={14}
            className="shrink-0 text-neutral-400"
          />
          <p className="text-[11.5px] text-neutral-500">
            {isPendingVerdict
              ? 'Diskusi sedang ditutup, menunggu kesimpulan AI.'
              : 'Diskusi ini sudah selesai dan bersifat read-only.'}
          </p>
        </div>
      )}
    </div>
  )
}