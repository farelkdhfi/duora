'use client'

import { useState } from 'react'
import { Loader2, RefreshCw, Send, Sparkles } from 'lucide-react'

import {
  useRequestAiAnalysis,
  useSendDebateMessage,
} from '../queries'

type Provider = 'auto' | 'openrouter' | 'groq'

interface DebateComposerProps {
  debateId: string
  isRoomActive: boolean
  isPendingVerdict: boolean
  isAiProcessing: boolean
  isAiRequestedByMe: boolean
  aiRequesterName: string | null
  userMessageCount: number
  maxMessages: number
  hasUserMessage: boolean
  hasNewMessageSinceLastAiComment: boolean
  canRequestAiComment: boolean
}

export default function DebateComposer({
  debateId,
  isRoomActive,
  isPendingVerdict,
  isAiProcessing,
  isAiRequestedByMe,
  aiRequesterName,
  userMessageCount,
  maxMessages,
  hasUserMessage,
  hasNewMessageSinceLastAiComment,
  canRequestAiComment,
}: DebateComposerProps) {
  const [input, setInput] = useState('')
  const [selectedProvider, setSelectedProvider] =
    useState<Provider>('auto')

  const [lastAiError, setLastAiError] = useState<{
    mode: 'comment' | 'final_verdict'
    provider?: 'openrouter' | 'groq'
  } | null>(null)

  const sendMessageMutation =
    useSendDebateMessage(debateId)

  const requestAiMutation =
    useRequestAiAnalysis(debateId)

  const maxLabel =
    maxMessages >= 999999 ? '∞' : maxMessages

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
        : `${aiRequesterName ?? 'Your babe'} is requesting AI assistance`
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
    <>
      {/* AI ERROR */}

      {lastAiError && (
        <div className="relative z-30 shrink-0 border-t border-red-500/[0.08] bg-red-50/70 px-3.5 py-2.5 sm:px-7 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <p className="min-w-0 flex-1 truncate text-[9px] leading-5 text-red-500/80 sm:text-[10.5px]">
              {requestAiMutation.error?.message ??
                'AI failed to respond.'}
            </p>

            <button
              type="button"
              onClick={handleRetryAiComment}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1.5 text-[9px] font-semibold text-red-500 transition hover:bg-red-100/70 sm:px-2.5 sm:text-[10px]"
            >
              <RefreshCw size={10} strokeWidth={1.8} />

              <span className="hidden xs:inline">
                Try again
              </span>

              <span className="xs:hidden">Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* COMPOSER */}

      {isRoomActive ? (
        <div className="relative z-30 shrink-0 border-t border-black/[0.045] bg-[#faf9f6]/95 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <div className="mx-auto max-w-4xl">
            {/* AI ACTION */}

            <div className="mb-2 flex items-center justify-between gap-2 px-1 sm:mb-2.5 sm:gap-3">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleRequestAiComment}
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
                    <Sparkles size={11} strokeWidth={1.8} />
                  )}

                  <span className="hidden xs:inline">
                    Ask Duora AI
                  </span>

                  <span className="xs:hidden">AI</span>
                </button>

                <select
                  value={selectedProvider}
                  onChange={(e) =>
                    setSelectedProvider(
                      e.target.value as Provider,
                    )
                  }
                  disabled={isAiProcessing}
                  aria-label="AI provider"
                  className="h-8 max-w-[80px] cursor-pointer appearance-none rounded-full border border-black/[0.055] bg-white px-2.5 text-[8px] font-medium text-neutral-400 outline-none transition hover:border-black/[0.09] hover:text-neutral-600 disabled:cursor-not-allowed disabled:opacity-40 sm:max-w-none sm:px-3 sm:text-[9px]"
                >
                  <option value="auto">Auto</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="groq">Groq</option>
                </select>
              </div>

              <span className="shrink-0 text-[8px] font-medium text-neutral-300 sm:text-[9px]">
                {userMessageCount}/{maxLabel}
              </span>
            </div>

            {/* INPUT */}

            <div className="relative flex items-end gap-1.5 rounded-[1.35rem] border border-black/[0.065] bg-white p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.045)] transition-all focus-within:border-black/[0.11] focus-within:shadow-[0_14px_45px_rgba(0,0,0,0.065)] sm:gap-2 sm:rounded-[1.6rem]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={
                  isAiProcessing
                    ? 'Waiting for the mediator...'
                    : "Say what's on your mind..."
                }
                disabled={isAiProcessing}
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
                  <Send size={14} strokeWidth={1.8} />
                )}
              </button>
            </div>

            {/* CONTEXT */}

            <div className="mt-1.5 flex items-center justify-between gap-3 px-2 sm:mt-2">
              <p className="hidden text-[8px] text-neutral-300 sm:block sm:text-[8.5px]">
                Enter to share · Shift + Enter for a new
                line
              </p>

              <p className="text-[7.5px] text-neutral-300 sm:hidden">
                Enter to share
              </p>

              {isAiProcessing && (
                <p className="min-w-0 truncate text-right text-[7.5px] text-neutral-400 sm:text-[8.5px]">
                  {isAiRequestedByMe
                    ? 'The mediator is listening...'
                    : `${aiRequesterName ?? 'Your partner'} invited the mediator`}
                </p>
              )}

              {!isAiProcessing &&
                hasUserMessage &&
                !hasNewMessageSinceLastAiComment && (
                  <p className="hidden text-right text-[8.5px] text-neutral-300 sm:block">
                    Share another thought to invite the
                    mediator again.
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
    </>
  )
}