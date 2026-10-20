'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Eraser } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Stroke } from '../types'

const COLORS = ['#171717', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
const SIZES = [3, 7, 14]
const BASE_WIDTH = 600
const FLUSH_MS = 50

interface DrawCanvasProps {
  roundId: string
  isDrawer: boolean
  locked: boolean // true setelah ronde selesai: tidak bisa menggambar lagi
}

export default function DrawCanvas({ roundId, isDrawer, locked }: DrawCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)
  const readyRef = useRef(false)

  const strokesRef = useRef<Stroke[]>([])
  const currentRef = useRef<Stroke | null>(null)
  const pendingRef = useRef<[number, number][]>([])
  const flushTimerRef = useRef<number | null>(null)

  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(SIZES[1])
  const colorRef = useRef(color)
  const sizeRef = useRef(size)
  colorRef.current = color
  sizeRef.current = size

  /* ---------------- rendering ---------------- */

  const drawSegment = useCallback(
    (stroke: Stroke, from: [number, number], to: [number, number]) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      ctx.strokeStyle = stroke.color
      ctx.fillStyle = stroke.color
      ctx.lineWidth = (stroke.size * canvas.width) / BASE_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(from[0] * canvas.width, from[1] * canvas.height)
      ctx.lineTo(to[0] * canvas.width, to[1] * canvas.height)
      ctx.stroke()
    },
    [],
  )

  const renderAll = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const stroke of strokesRef.current) {
      const pts = stroke.points
      if (pts.length === 1) drawSegment(stroke, pts[0], pts[0])
      for (let i = 1; i < pts.length; i++) drawSegment(stroke, pts[i - 1], pts[i])
    }
  }, [drawSegment])

  /* ---------------- ukuran canvas ---------------- */

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = wrap.clientWidth
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(width * 0.75 * dpr) // rasio 4:3
      renderAll()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [renderAll])

  /* ---------------- broadcast channel ---------------- */

  useEffect(() => {
    strokesRef.current = []
    renderAll()

    const supabase = createClient()
    const channel = supabase.channel(`draw-strokes-${roundId}`, {
      config: { broadcast: { self: false } },
    })

    channel
      .on('broadcast', { event: 'stroke' }, ({ payload }) => {
        if (isDrawer) return
        const { id, color, size, points } = payload as Stroke

        let stroke = strokesRef.current.find((s) => s.id === id)
        if (!stroke) {
          stroke = { id, color, size, points: [] }
          strokesRef.current.push(stroke)
        }

        for (const p of points) {
          const last = stroke.points[stroke.points.length - 1]
          stroke.points.push(p)
          drawSegment(stroke, last ?? p, p)
        }
      })
      .on('broadcast', { event: 'clear' }, () => {
        if (isDrawer) return
        strokesRef.current = []
        renderAll()
      })
      .on('broadcast', { event: 'sync-state' }, ({ payload }) => {
        if (isDrawer) return
        strokesRef.current = (payload as { strokes: Stroke[] }).strokes
        renderAll()
      })
      .on('broadcast', { event: 'sync-request' }, () => {
        if (!isDrawer) return
        channel.send({
          type: 'broadcast',
          event: 'sync-state',
          payload: { strokes: strokesRef.current },
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          readyRef.current = true
          // pasangan yang baru masuk atau reconnect minta gambar yang sudah ada
          if (!isDrawer) {
            channel.send({ type: 'broadcast', event: 'sync-request', payload: {} })
          }
        }
      })

    channelRef.current = channel

    return () => {
      readyRef.current = false
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [roundId, isDrawer, drawSegment, renderAll])

  /* ---------------- input penggambar ---------------- */

  const flush = useCallback(() => {
    flushTimerRef.current = null
    const stroke = currentRef.current
    const points = pendingRef.current
    if (!stroke || points.length === 0 || !readyRef.current) return

    pendingRef.current = []
    channelRef.current?.send({
      type: 'broadcast',
      event: 'stroke',
      payload: { id: stroke.id, color: stroke.color, size: stroke.size, points },
    })
  }, [])

  function getPoint(e: React.PointerEvent): [number, number] {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1)
    return [Math.round(x * 10000) / 10000, Math.round(y * 10000) / 10000]
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!isDrawer || locked) return
    e.currentTarget.setPointerCapture(e.pointerId)

    const p = getPoint(e)
    const stroke: Stroke = {
      id: crypto.randomUUID(),
      color: colorRef.current,
      size: sizeRef.current,
      points: [p],
    }

    strokesRef.current.push(stroke)
    currentRef.current = stroke
    pendingRef.current = [p]
    drawSegment(stroke, p, p)

    if (!flushTimerRef.current) flushTimerRef.current = window.setTimeout(flush, FLUSH_MS)
  }

  function handlePointerMove(e: React.PointerEvent) {
    const stroke = currentRef.current
    if (!isDrawer || locked || !stroke) return

    const p = getPoint(e)
    const last = stroke.points[stroke.points.length - 1]
    stroke.points.push(p)
    pendingRef.current.push(p)
    drawSegment(stroke, last, p)

    if (!flushTimerRef.current) flushTimerRef.current = window.setTimeout(flush, FLUSH_MS)
  }

  function handlePointerUp() {
    if (!currentRef.current) return
    flush()
    currentRef.current = null
  }

  function handleClear() {
    if (!isDrawer || locked) return
    strokesRef.current = []
    renderAll()
    channelRef.current?.send({ type: 'broadcast', event: 'clear', payload: {} })
  }

    return (
    <div className="min-w-0 space-y-3">
      <div ref={wrapRef} className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white shadow-[0_0_50px_-15px_rgba(244,114,182,0.3)]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`block size-full touch-none ${isDrawer && !locked ? 'cursor-crosshair' : 'cursor-default'}`}
        />
      </div>

      {isDrawer && !locked && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-primary/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Warna ${c}`}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`size-7 rounded-full border-2 transition ${color === c ? 'scale-110 border-secondary' : 'border-primary shadow'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`Ukuran ${s}`}
                onClick={() => setSize(s)}
                className={`flex size-8 items-center justify-center rounded-full border bg-subprimary transition ${size === s ? 'border-secondary' : 'border-white/[0.08]'}`}
              >
                <span className="rounded-full bg-secondary" style={{ width: s + 2, height: s + 2 }} />
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="flex h-8 items-center gap-1 rounded-full border border-white/[0.08] bg-subprimary px-3 text-[11px] font-medium text-description hover:bg-subprimary/80"
            >
              <Eraser size={12} />
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  )
}