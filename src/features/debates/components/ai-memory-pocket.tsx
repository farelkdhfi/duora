'use client'

import { X } from 'lucide-react'

import type { DebateMessage } from '../types'
import DebateMessageBubble from './debate-message-bubble'
import DateSeparator from './date-separator'

interface AiMemoryPocketProps {
  messages: DebateMessage[]
  onClose: () => void
}

function isSameDay(dateA: string, dateB: string) {
  return (
    new Date(dateA).toDateString() ===
    new Date(dateB).toDateString()
  )
}

export default function AiMemoryPocket({
  messages,
  onClose,
}: AiMemoryPocketProps) {
  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-neutral-950/20 p-2.5 backdrop-blur-[3px] sm:items-center sm:p-6">
      <div className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.6rem] border border-black/[0.06] bg-[#faf9f6] shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:max-h-[82vh] sm:rounded-[2rem]">
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-blue-300/[0.09] blur-[70px]" />

        <div className="pointer-events-none absolute -left-20 bottom-0 size-48 rounded-full bg-pink-300/[0.07] blur-[70px]" />

        {/* HEADER */}

        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-black/[0.05] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:text-[8px]">
              Memory pocket
            </p>

            <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.04em] text-neutral-900 sm:text-[19px]">
              Duora AI
            </h2>

            <p className="mt-1 text-[9px] text-neutral-400 sm:text-[10px]">
              {messages.length}{' '}
              {messages.length === 1
                ? 'saved response'
                : 'saved responses'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI memory pocket"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.05] bg-white text-neutral-400 transition hover:bg-neutral-900 hover:text-white sm:size-9"
          >
            <X size={13} strokeWidth={1.7} />
          </button>
        </header>

        {/* CONTENT */}

        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-2">
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

                  <div className="py-2">
                    <DebateMessageBubble
                      message={message}
                      currentUserId=""
                      variant={
                        message.is_final_verdict
                          ? 'resolution'
                          : 'history'
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}