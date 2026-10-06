"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { QNA_CATEGORIES } from "../category-info";
import { useStartNewQna } from "../queries";
import type { QnaCategory } from "../types";

interface CategoryPickerProps {
  onSessionStarted?: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Pengaturan — ubah angka di sini untuk menyetel "rasa" animasinya           */
/* -------------------------------------------------------------------------- */

const TOTAL = QNA_CATEGORIES.length;
// Putaran tanpa ujung hanya mulus kalau ada minimal 3 kartu.
const LOOP = TOTAL > 2;

// Bentuk tumpukan kartu (sama seperti desain sebelumnya)
const SPREAD = 0.42; // jarak kartu samping dari tengah (dalam lebar kartu)
const TILT = 7; // kemiringan kartu samping (derajat)
const SIDE_SCALE = 0.86;
const SIDE_OPACITY = 0.75;
const LIFT = 0.018; // kartu sedikit terangkat saat berpindah (0 = mati)

// Gesture
const DRAG_START_PX = 6; // gerakan minimal sebelum dianggap drag
const FLICK_PX_PER_SEC = 380; // kecepatan minimal agar dianggap flick
const SNAP_DISTANCE = 0.28; // jarak drag minimal (dalam kartu) tanpa flick
const MAX_RELEASE_SPEED = 7; // batas kecepatan awal spring (kartu / detik)

// Spring: STIFFNESS naik = lebih cepat · DAMPING turun = lebih membal
const STIFFNESS = 190;
const DAMPING = 26;
const REST_DISTANCE = 0.0005;
const REST_SPEED = 0.02;
const MAX_FRAME_TIME = 1 / 30;
const SUBSTEP = 1 / 240;

/* -------------------------------------------------------------------------- */
/*  Tipe & helper murni                                                        */
/* -------------------------------------------------------------------------- */

interface Frame {
  transform: string;
  opacity: string;
  zIndex: number;
  visibility: "visible" | "hidden";
  sel: string; // 0 = kartu samping, 1 = kartu di tengah
}

interface DragSample {
  t: number;
  x: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  startPosition: number;
  startTarget: number;
  unit: number; // jarak jari (px) untuk berpindah satu kartu
  active: boolean;
  samples: DragSample[];
}

const mod = (value: number, size: number) => ((value % size) + size) % size;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const fixed = (value: number) => value.toFixed(4);

/** Jarak bertanda terpendek ke tengah (mendukung putaran tanpa ujung). */
function wrap(distance: number) {
  return LOOP ? distance - TOTAL * Math.round(distance / TOTAL) : distance;
}

/** Setelah melewati 1 kartu, gerakan jadi "berat" seperti ditahan karet. */
function softLimit(delta: number) {
  const abs = Math.abs(delta);
  if (abs <= 1) return delta;
  return Math.sign(delta) * (1 + 0.25 * (1 - Math.exp(-(abs - 1) * 2)));
}

/** Mode tanpa loop: tahan di ujung dengan efek karet. */
function bound(position: number) {
  if (LOOP) return position;
  const max = TOTAL - 1;
  if (position < 0) return position * 0.3;
  if (position > max) return max + (position - max) * 0.3;
  return position;
}

/** Kecepatan jari (px/detik) dari beberapa sampel terakhir. */
function releaseVelocity(samples: DragSample[], now: number) {
  const recent = samples.filter((sample) => now - sample.t <= 100);
  if (recent.length < 2) return 0;
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsed = last.t - first.t;
  if (elapsed <= 0) return 0;
  return ((last.x - first.x) / elapsed) * 1000;
}

/** Semua properti kartu dihitung dari jaraknya ke tengah. Tidak ada state diskrit. */
function getFrame(index: number, position: number): Frame {
  const d = wrap(index - position);
  const a = Math.abs(d);

  const x = d * SPREAD;
  const y = -LIFT * Math.sin(Math.PI * Math.min(a, 1));
  const rotate = d * TILT;
  const scale = 1 - (1 - SIDE_SCALE) * Math.min(a, 1.5);
  const opacity =
    a <= 1
      ? 1 - (1 - SIDE_OPACITY) * a
      : Math.max(0, SIDE_OPACITY * (1 - (a - 1) / 0.5));

  return {
    transform: `translate3d(${fixed(-50 + x * 100)}%, ${fixed(-50 + y * 100)}%, 0) rotate(${fixed(rotate)}deg) scale(${fixed(scale)})`,
    opacity: fixed(opacity),
    zIndex: Math.round(1000 - a * 100),
    visibility: opacity > 0.01 ? "visible" : "hidden",
    sel: fixed(Math.max(0, 1 - a)),
  };
}

function applyFrame(element: HTMLElement, frame: Frame) {
  element.style.transform = frame.transform;
  element.style.opacity = frame.opacity;
  element.style.zIndex = String(frame.zIndex);
  element.style.visibility = frame.visibility;
  element.style.setProperty("--sel", frame.sel);
}

function frameToStyle(frame: Frame): CSSProperties {
  return {
    transform: frame.transform,
    opacity: frame.opacity,
    zIndex: frame.zIndex,
    visibility: frame.visibility,
    "--sel": frame.sel,
  } as CSSProperties;
}

type RGBA = readonly [number, number, number, number];

/**
 * Warna yang berubah halus dari `from` (kartu samping) ke `to` (kartu tengah)
 * mengikuti CSS variable --sel milik tiap kartu.
 */
function blend(from: RGBA, to: RGBA) {
  const channel = (i: number) =>
    `calc(${from[i]} + (${Number((to[i] - from[i]).toFixed(3))}) * var(--sel))`;
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)} / ${channel(3)})`;
}

const COLOR = {
  label: blend([0, 0, 0, 0.25], [255, 255, 255, 0.35]),
  title: blend([23, 23, 23, 1], [255, 255, 255, 1]),
  description: blend([0, 0, 0, 0.4], [255, 255, 255, 0.45]),
  chipBorder: blend([0, 0, 0, 0.06], [255, 255, 255, 0.1]),
  chipBackground: blend([255, 255, 255, 1], [255, 255, 255, 0.07]),
  chipIcon: blend([0, 0, 0, 0.3], [255, 255, 255, 0.5]),
};

/* -------------------------------------------------------------------------- */
/*  Komponen                                                                   */
/* -------------------------------------------------------------------------- */

export function CategoryPicker({ onSessionStarted }: CategoryPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exhaustedIds, setExhaustedIds] = useState<QnaCategory[]>([]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State animasi disimpan di ref, jadi tidak ada re-render React di tiap frame.
  const positionRef = useRef(0); // posisi kontinu (satuan: kartu), boleh pecahan
  const velocityRef = useRef(0); // kartu / detik
  const targetRef = useRef(0); // tujuan akhir (bilangan bulat)
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const { mutate: startNewQna, isPending } = useStartNewQna();

  const selectedCategory = QNA_CATEGORIES[selectedIndex];

  // Dihitung sekali: cocok untuk SSR/hydration dan React tidak akan menimpa
  // transform yang sedang dianimasikan lewat ref.
  const initialStyles = useMemo(
    () => QNA_CATEGORIES.map((_, index) => frameToStyle(getFrame(index, 0))),
    [],
  );

  /* ------------------------------ Engine ---------------------------------- */

  const applyPosition = useCallback((position: number) => {
    for (let index = 0; index < TOTAL; index++) {
      const element = cardRefs.current[index];
      if (element) applyFrame(element, getFrame(index, position));
    }
  }, []);

  // Jaga angka tetap kecil setelah berputar. Tampilan tidak berubah.
  const normalize = useCallback(() => {
    if (!LOOP) return;
    const shift = Math.floor(targetRef.current / TOTAL) * TOTAL;
    if (shift === 0) return;
    targetRef.current -= shift;
    positionRef.current -= shift;
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  // Jalankan spring menuju targetRef
  const wake = useCallback(() => {
    if (rafRef.current !== null || dragRef.current?.active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      positionRef.current = targetRef.current;
      velocityRef.current = 0;
      applyPosition(positionRef.current);
      normalize();
      return;
    }

    const tick = (time: number) => {
      const previous = lastTimeRef.current ?? time - 1000 / 60;
      lastTimeRef.current = time;

      let remaining = Math.min(
        Math.max((time - previous) / 1000, 0),
        MAX_FRAME_TIME,
      );
      let position = positionRef.current;
      let velocity = velocityRef.current;
      const target = targetRef.current;

      while (remaining > 0) {
        const step = Math.min(remaining, SUBSTEP);
        velocity +=
          (-STIFFNESS * (position - target) - DAMPING * velocity) * step;
        position += velocity * step;
        remaining -= step;
      }

      const atRest =
        Math.abs(position - target) < REST_DISTANCE &&
        Math.abs(velocity) < REST_SPEED;

      if (atRest) {
        position = target;
        velocity = 0;
      }

      positionRef.current = position;
      velocityRef.current = velocity;
      applyPosition(position);

      if (atRest) {
        rafRef.current = null;
        lastTimeRef.current = null;
        normalize();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [applyPosition, normalize]);

  const commitTarget = useCallback(
    (rawTarget: number) => {
      if (TOTAL < 2) return;
      const target = LOOP ? rawTarget : clamp(rawTarget, 0, TOTAL - 1);
      targetRef.current = target;
      setSelectedIndex(mod(target, TOTAL));
      wake();
    },
    [wake],
  );

  useEffect(() => stop, [stop]);

  /* ---------------------------- Navigasi ---------------------------------- */

  function goNext() {
    if (isPending) return;
    commitTarget(targetRef.current + 1);
  }

  function goPrevious() {
    if (isPending) return;
    commitTarget(targetRef.current - 1);
  }

  function goToIndex(index: number) {
    if (isPending) return;

    let difference = index - mod(targetRef.current, TOTAL);
    if (LOOP) {
      if (difference > TOTAL / 2) difference -= TOTAL;
      else if (difference < -TOTAL / 2) difference += TOTAL;
    }

    commitTarget(targetRef.current + difference);
  }

  function handleSelectCategory() {
    if (!selectedCategory || isPending) return;

    const categoryId = selectedCategory.id;

    startNewQna(categoryId, {
      onSuccess: () => {
        setExhaustedIds((previous) =>
          previous.filter((id) => id !== categoryId),
        );
        onSessionStarted?.();
      },
      onError: (error) => {
        if (error.message.includes("QNA_EXHAUSTED")) {
          setExhaustedIds((previous) =>
            previous.includes(categoryId)
              ? previous
              : [...previous, categoryId],
          );
        }
      },
    });
  }

  function handleCardClick(index: number) {
    if (isPending) return;

    if (index === selectedIndex) {
      handleSelectCategory();
    } else {
      goToIndex(index);
    }
  }

  /* ------------------------------ Gesture --------------------------------- */

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (isPending || TOTAL < 2 || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    suppressClickRef.current = false;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: 0,
      startTarget: 0,
      unit: (cardRefs.current[0]?.offsetWidth ?? 300) * SPREAD,
      active: false,
      samples: [],
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    // Mouse dilepas di luar stage sebelum drag aktif → batalkan
    if (event.pointerType === "mouse" && event.buttons === 0) {
      dragRef.current = null;
      return;
    }

    if (!drag.active) {
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (Math.hypot(dx, dy) < DRAG_START_PX) return;

      // Dominan vertikal → biarkan halaman yang scroll
      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null;
        return;
      }

      // Mulai drag: "tangkap" kartu di posisi sekarang (kalau masih bergerak)
      stop();
      velocityRef.current = 0;
      drag.active = true;
      drag.startX = event.clientX; // re-base supaya kartu tidak loncat
      drag.startPosition = positionRef.current;
      drag.startTarget = targetRef.current;
      drag.samples = [];
      suppressClickRef.current = true;

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* pointer sudah tidak aktif, abaikan */
      }
    }

    const now = performance.now();
    drag.samples.push({ t: now, x: event.clientX });
    while (drag.samples.length > 2 && now - drag.samples[0].t > 120) {
      drag.samples.shift();
    }

    // Jari geser ke kiri → posisi bertambah → kartu berikutnya masuk
    const delta = softLimit((drag.startX - event.clientX) / drag.unit);
    const next = bound(drag.startPosition + delta);

    positionRef.current = next;
    applyPosition(next);
  }

  function endDrag(
    event: ReactPointerEvent<HTMLDivElement>,
    cancelled: boolean,
  ) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    // Cuma tap → biarkan onClick yang bekerja
    if (!drag.active) return;

    // Abaikan click susulan setelah drag
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);

    const pxPerSecond = cancelled
      ? 0
      : releaseVelocity(drag.samples, performance.now());
    const velocity = -pxPerSecond / drag.unit; // kartu / detik
    const moved = positionRef.current - drag.startPosition; // kartu

    let direction = 0;
    if (!cancelled) {
      if (Math.abs(pxPerSecond) > FLICK_PX_PER_SEC) {
        direction = Math.sign(velocity);
      } else if (Math.abs(moved) > SNAP_DISTANCE) {
        direction = Math.sign(moved);
      }
    }

    // Kartu meluncur dengan momentum jari, lalu mendarat dengan spring
    velocityRef.current = clamp(
      velocity,
      -MAX_RELEASE_SPEED,
      MAX_RELEASE_SPEED,
    );
    commitTarget(drag.startTarget + direction);
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  }

  /* ------------------------------- Render --------------------------------- */

  return (
    <div className="w-full">
      {/* Card Stage */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Pilih kategori"
        className="relative isolate h-[400px] w-full touch-pan-y select-none overflow-visible [-webkit-tap-highlight-color:transparent]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
      >
        {QNA_CATEGORIES.map((category, index) => {
          const isLoadingThis = isPending && index === selectedIndex;
          const isExhausted = exhaustedIds.includes(category.id);

          return (
            <div
              key={category.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className="absolute left-1/2 top-1/2 h-[330px] w-[min(78vw,320px)] will-change-transform [backface-visibility:hidden] sm:h-[350px] sm:w-[320px]"
              style={initialStyles[index]}
            >
              {/* Bayangan: dua layer yang cross-fade, jadi tidak ada loncatan box-shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[0_20px_55px_-35px_rgba(0,0,0,0.2)] will-change-[opacity]"
                style={{ opacity: "calc(1 - var(--sel))" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[0_30px_80px_-35px_rgba(30,19,24,0.65)] will-change-[opacity]"
                style={{ opacity: "var(--sel)" }}
              />

              <button
  type="button"
  disabled={isPending}
  onClick={() => handleCardClick(index)}
  className="relative isolate block h-full w-full transform-gpu cursor-grab overflow-hidden rounded-[32px] border border-black/[0.07] text-left active:cursor-grabbing"
  style={{ backgroundColor: category.cardColor }}
>
                {/* Layer gelap + glow: di-fade masuk/keluar, bukan ganti warna instan */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[#1e1318] will-change-[opacity]"
                  style={{ opacity: "var(--sel)" }}
                >
                  <div
                    className={`absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-40 blur-3xl ${category.colorClass}`}
                  />
                  <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: COLOR.label }}
                    >
                      Q&A · {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full border"
                      style={{
                        borderColor: COLOR.chipBorder,
                        backgroundColor: COLOR.chipBackground,
                        color: COLOR.chipIcon,
                      }}
                    >
                      {isLoadingThis ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ArrowRight size={14} />
                      )}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div
                      className={`mb-5 h-1.5 w-10 rounded-full ${category.colorClass}`}
                    />

                    <h3
                      className="text-[25px] font-semibold leading-tight tracking-[-0.04em]"
                      style={{ color: COLOR.title }}
                    >
                      {category.name}
                    </h3>

                    <p
                      className="mt-3 text-sm leading-6"
                      style={{ color: COLOR.description }}
                    >
                      {category.description}
                    </p>

                    {/* Selalu dirender (tidak di-mount/unmount) supaya layout tidak lompat */}
                    <div
                      className="mt-7"
                      style={{ opacity: "calc((var(--sel) - 0.55) / 0.45)" }}
                    >
                      {isExhausted ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                          <p className="text-[11px] leading-5 text-white/45">
                            Pertanyaan di kategori ini sudah habis. Coba
                            kategori lainnya.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                          Tap untuk mulai
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-1 flex items-center justify-center gap-5">
        <button
          type="button"
          disabled={isPending}
          onClick={goPrevious}
          aria-label="Kategori sebelumnya"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white text-black/35 transition-all hover:border-black/10 hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight size={14} className="rotate-180" />
        </button>

        <div className="flex items-center gap-1.5">
          {QNA_CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              type="button"
              disabled={isPending}
              onClick={() => goToIndex(index)}
              aria-label={`Pilih ${category.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-5 bg-[#1e1318]"
                  : "w-1.5 bg-black/15 hover:bg-black/30"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={goNext}
          aria-label="Kategori berikutnya"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white text-black/35 transition-all hover:border-black/10 hover:text-black/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight size={14} />
        </button>
      </div>

      <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-black/20">
        Swipe to change
      </p>
    </div>
  );
}