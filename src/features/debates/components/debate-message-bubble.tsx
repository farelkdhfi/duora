'use client'

import type { DebateMessage } from '../types'

interface DebateMessageBubbleProps {
  message: DebateMessage
  currentUserId: string
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

function renderListItem(item: unknown): string {
  if (typeof item === 'string') {
    return item
  }

  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>

    const values = Object.values(obj)
      .filter((v) => typeof v === 'string')
      .join(': ')

    return values || JSON.stringify(item)
  }

  return String(item)
}

export default function DebateMessageBubble({
  message,
  currentUserId,
}: DebateMessageBubbleProps) {
  /* ===================================================== */
  /* AI MESSAGE */
  /* ===================================================== */

  if (message.role === 'ai') {
    const analysis = message.ai_analysis
    const isFinal = message.is_final_verdict

    return (
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <div
          className={`
            relative
            mx-auto
            w-full
            max-w-2xl
            overflow-hidden
            rounded-[2rem]
            border
            ${
              isFinal
                ? 'border-neutral-900/[0.08] bg-neutral-950 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]'
                : 'border-black/[0.055] bg-white text-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.035)]'
            }
          `}
        >
          {/* subtle ambient accent */}

          {!isFinal && (
            <>
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  size-32
                  rounded-full
                  bg-blue-400/[0.055]
                  blur-[60px]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -left-16
                  bottom-0
                  size-32
                  rounded-full
                  bg-pink-400/[0.045]
                  blur-[60px]
                "
              />
            </>
          )}

          {/* CONTENT */}

          <div className="relative p-5 sm:p-6">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    ${
                      isFinal
                        ? 'text-white/35'
                        : 'text-neutral-300'
                    }
                  `}
                >
                  {isFinal
                    ? 'Verdict'
                    : 'AI Mediator'}
                </p>

                {isFinal && (
                  <h3
                    className="
                      mt-1
                      text-[15px]
                      font-semibold
                      tracking-[-0.025em]
                      text-white
                    "
                  >
                    Discussion verdict
                  </h3>
                )}
              </div>

              <div className="flex items-center gap-2">
                {message.ai_provider && (
                  <span
                    className={`
                      rounded-full
                      px-2
                      py-1
                      text-[8px]
                      font-medium
                      tracking-wide
                      ${
                        isFinal
                          ? 'bg-white/[0.06] text-white/30'
                          : 'bg-neutral-50 text-neutral-300'
                      }
                    `}
                  >
                    {message.ai_provider}
                  </span>
                )}

                <span
                  className={`
                    text-[9px]
                    ${
                      isFinal
                        ? 'text-white/25'
                        : 'text-neutral-300'
                    }
                  `}
                >
                  {formatTime(message.created_at)}
                </span>
              </div>
            </div>

            {/* SUMMARY */}

            <p
              className={`
                ${
                  isFinal
                    ? 'mt-5 text-[14px] leading-7 text-white/[0.78]'
                    : 'mt-4 text-[13px] leading-6 text-neutral-600'
                }
              `}
            >
              {analysis?.summary ?? message.content}
            </p>

            {/* FINAL ARGUMENT */}

            {isFinal &&
              analysis?.stronger_argument && (
                <div
                  className="
                    mt-6
                    border-t
                    border-white/[0.08]
                    pt-5
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-amber-400/70
                    "
                  >
                    Stronger argument
                  </p>

                  <p
                    className="
                      mt-2
                      text-[12.5px]
                      leading-6
                      text-white/[0.72]
                    "
                  >
                    {analysis.stronger_argument}
                  </p>
                </div>
              )}

            {/* ANALYSIS */}

            <div
              className={`
                ${
                  analysis?.facts?.length ||
                  analysis?.opinions?.length
                    ? 'mt-6'
                    : ''
                }
              `}
            >
              {/* FACTS */}

              {Boolean(analysis?.facts?.length) && (
                <div
                  className={`
                    ${
                      analysis?.opinions?.length
                        ? 'pb-5'
                        : ''
                    }
                  `}
                >
                  <p
                    className={`
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      ${
                        isFinal
                          ? 'text-white/30'
                          : 'text-neutral-300'
                      }
                    `}
                  >
                    Facts
                  </p>

                  <ul className="mt-2.5 space-y-2">
                    {analysis!.facts.map(
                      (fact, i) => (
                        <li
                          key={i}
                          className={`
                            pl-3
                            text-[11.5px]
                            leading-5
                            ${
                              isFinal
                                ? 'border-l border-white/[0.08] text-white/[0.58]'
                                : 'border-l border-neutral-200 text-neutral-500'
                            }
                          `}
                        >
                          {renderListItem(fact)}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* OPINIONS */}

              {Boolean(analysis?.opinions?.length) && (
                <div
                  className={`
                    ${
                      analysis?.facts?.length
                        ? `border-t pt-5 ${
                            isFinal
                              ? 'border-white/[0.06]'
                              : 'border-black/[0.045]'
                          }`
                        : ''
                    }
                  `}
                >
                  <p
                    className={`
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      ${
                        isFinal
                          ? 'text-white/30'
                          : 'text-neutral-300'
                      }
                    `}
                  >
                    Perspectives
                  </p>

                  <ul className="mt-2.5 space-y-2">
                    {analysis!.opinions.map(
                      (opinion, i) => (
                        <li
                          key={i}
                          className={`
                            pl-3
                            text-[11.5px]
                            leading-5
                            ${
                              isFinal
                                ? 'border-l border-pink-400/20 text-white/[0.58]'
                                : 'border-l border-pink-300/30 text-neutral-500'
                            }
                          `}
                        >
                          {renderListItem(opinion)}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* COMMON GROUND */}

            {analysis?.common_ground && (
              <div
                className={`
                  mt-6
                  rounded-[1.25rem]
                  border
                  p-4
                  ${
                    isFinal
                      ? 'border-white/[0.06] bg-white/[0.035]'
                      : 'border-black/[0.045] bg-neutral-50/70'
                  }
                `}
              >
                <p
                  className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    ${
                      isFinal
                        ? 'text-white/30'
                        : 'text-neutral-300'
                    }
                  `}
                >
                  Common ground
                </p>

                <p
                  className={`
                    mt-2
                    text-[11.5px]
                    leading-5
                    ${
                      isFinal
                        ? 'text-white/[0.62]'
                        : 'text-neutral-500'
                    }
                  `}
                >
                  {analysis.common_ground}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ===================================================== */
  /* USER MESSAGE */
  /* ===================================================== */

  const isOwnMessage =
    message.sender_id === currentUserId

  const senderName =
    message.profiles?.display_name ??
    message.profiles?.username ??
    'Someone'

  return (
    <div
      className={`
        flex
        px-4
        py-1.5
        sm:px-6
        ${isOwnMessage ? 'justify-end' : 'justify-start'}
      `}
    >
      <div
        className={`
          max-w-[78%]
          ${
            isOwnMessage
              ? 'rounded-[1.4rem] rounded-br-md bg-neutral-900 text-white shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
              : 'rounded-[1.4rem] rounded-bl-md border border-black/[0.045] bg-neutral-50 text-neutral-900'
          }
          px-4
          py-3
          sm:max-w-[65%]
        `}
      >
        {!isOwnMessage && (
          <p
            className="
              mb-1.5
              text-[9px]
              font-semibold
              tracking-[-0.005em]
              text-neutral-400
            "
          >
            {senderName}
          </p>
        )}

        <p
          className="
            whitespace-pre-line
            break-words
            text-[12.5px]
            leading-[1.65]
            tracking-[-0.005em]
          "
        >
          {message.content}
        </p>

        <p
          className={`
            mt-2
            text-right
            text-[8.5px]
            ${
              isOwnMessage
                ? 'text-white/25'
                : 'text-neutral-300'
            }
          `}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  )
}