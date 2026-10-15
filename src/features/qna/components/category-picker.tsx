"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
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

// Bentuk tumpukan kartu
const SPREAD = 0.42; // jarak kartu samping dari tengah (dalam lebar kartu)
const TILT = 7; // kemiringan kartu samping (derajat)
const SIDE_SCALE = 0.86;
const SIDE_OPACITY = 0.75;
const LIFT = 0.018; // kartu sedikit terangkat saat berpindah (0 = mati)

// Gesture
const FLICK_PX_PER_SEC = 380; // kecepatan minimal agar dianggap flick
const SNAP_DISTANCE = 0.28; // jarak drag minimal (dalam kartu) tanpa flick
const MAX_RELEASE_SPEED = 7; // batas kecepatan awal spring (kartu / detik)

// Spring: STIFFNESS naik = lebih cepat · DAMPING turun = lebih membal
const STIFFNESS = 190;
const DAMPING = 26;
const REST_DISTANCE = 0.0005;
const REST_SPEED = 0.02;

/* -------------------------------------------------------------------------- */
/*  Helper murni                                                               */
/* -------------------------------------------------------------------------- */

type Category = (typeof QNA_CATEGORIES)[number];

interface DragState {
  startPosition: number;
  startTarget: number;
  unit: number; // jarak jari (px) untuk berpindah satu kartu
}

const mod = (value: number, size: number) => ((value % size) + size) % size;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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

/* -------------------------------------------------------------------------- */
/*  Kartu                                                                      */
/*  Semua nilai visual diturunkan dari satu MotionValue `position`, jadi       */
/*  framer-motion mengupdate DOM langsung tanpa re-render React.               */
/* -------------------------------------------------------------------------- */

interface CategoryCardProps {
  category: Category;
  index: number;
  position: MotionValue<number>;
  isLoading: boolean;
  isExhausted: boolean;
  disabled: boolean;
  onClick: () => void;
}

function CategoryCard({
  category,
  index,
  position,
  isLoading,
  isExhausted,
  disabled,
  onClick,
}: CategoryCardProps) {
  // Jarak bertanda ke tengah, dan "sel": 0 = kartu samping, 1 = kartu tengah
  const d = useTransform(position, (p) => wrap(index - p));
  const sel = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v)));

  const x = useTransform(d, (v) => `${-50 + v * SPREAD * 100}%`);
  const y = useTransform(d, (v) => {
    const lift = -LIFT * Math.sin(Math.PI * Math.min(Math.abs(v), 1));
    return `${-50 + lift * 100}%`;
  });
  const rotate = useTransform(d, (v) => v * TILT);
  const scale = useTransform(
    d,
    (v) => 1 - (1 - SIDE_SCALE) * Math.min(Math.abs(v), 1.5),
  );
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    return a <= 1
      ? 1 - (1 - SIDE_OPACITY) * a
      : Math.max(0, SIDE_OPACITY * (1 - (a - 1) / 0.5));
  });
  const zIndex = useTransform(d, (v) => Math.round(1000 - Math.abs(v) * 100));
  const pointerEvents = useTransform(opacity, (o) =>
    o > 0.01 ? "auto" : "none",
  );

  // Bayangan & layer gelap: cross-fade mengikuti sel
  const sideShadowOpacity = useTransform(sel, (v) => 1 - v);
  const footerOpacity = useTransform(sel, [0.55, 1], [0, 1]);

  // Warna berubah halus dari kartu samping (terang) ke kartu tengah (gelap)
  const labelColor = useTransform(
    sel,
    [0, 1],
    ["rgba(0,0,0,0.25)", "rgba(255,255,255,0.35)"],
  );
  const titleColor = useTransform(
    sel,
    [0, 1],
    ["rgba(23,23,23,1)", "rgba(255,255,255,1)"],
  );
  const descriptionColor = useTransform(
    sel,
    [0, 1],
    ["rgba(0,0,0,0.4)", "rgba(255,255,255,0.45)"],
  );
  const chipBorder = useTransform(
    sel,
    [0, 1],
    ["rgba(0,0,0,0.06)", "rgba(255,255,255,0.1)"],
  );
  const chipBackground = useTransform(
    sel,
    [0, 1],
    ["rgba(255,255,255,1)", "rgba(255,255,255,0.07)"],
  );
  const chipIcon = useTransform(
    sel,
    [0, 1],
    ["rgba(0,0,0,0.3)", "rgba(255,255,255,0.5)"],
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[330px] w-[min(78vw,320px)] will-change-transform [backface-visibility:hidden] sm:h-[350px] sm:w-[320px]"
      style={{ x, y, rotate, scale, opacity, zIndex, pointerEvents }}
    >
      {/* Bayangan: dua layer yang cross-fade, jadi tidak ada loncatan box-shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[0_20px_55px_-35px_rgba(0,0,0,0.5)]"
        style={{ opacity: sideShadowOpacity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[0_30px_80px_-35px_rgba(0,0,0,0.95)]"
        style={{ opacity: sel }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="relative isolate block h-full w-full transform-gpu cursor-grab overflow-hidden rounded-[32px]  text-left active:cursor-grabbing"
        style={{ backgroundColor: category.cardColor }}
      >
        {/* Layer gelap + glow: di-fade masuk/keluar, bukan ganti warna instan */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#1e1318]"
          style={{ opacity: sel }}
        >
          <div
            className={`absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-40 blur-3xl ${category.colorClass}`}
          />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        </motion.div>

        <div className="relative flex h-full flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <motion.span
              className="text-[10px] font-medium uppercase tracking-[0.18em]"
              style={{ color: labelColor }}
            >
              Q&A · {String(index + 1).padStart(2, "0")}
            </motion.span>

            <motion.span
              className="flex h-8 w-8 items-center justify-center rounded-full border"
              style={{
                borderColor: chipBorder,
                backgroundColor: chipBackground,
                color: chipIcon,
              }}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
            </motion.span>
          </div>

          <div className="mt-auto">
            <div
              className={`mb-5 h-1.5 w-10 rounded-full ${category.colorClass}`}
            />

            <motion.h3
              className="text-[25px] font-semibold leading-tight tracking-[-0.04em]"
              style={{ color: titleColor }}
            >
              {category.name}
            </motion.h3>

            <motion.p
              className="mt-3 text-sm leading-6"
              style={{ color: descriptionColor }}
            >
              {category.description}
            </motion.p>

            {/* Selalu dirender (tidak di-mount/unmount) supaya layout tidak lompat */}
            <motion.div className="mt-7" style={{ opacity: footerOpacity }}>
              {isExhausted ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                  <p className="text-[11px] leading-5 text-white/50">
                    Pertanyaan di kategori ini sudah habis. Coba kategori
                    lainnya.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  Tap untuk mulai
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Komponen utama                                                             */
/* -------------------------------------------------------------------------- */

export function CategoryPicker({ onSessionStarted }: CategoryPickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exhaustedIds, setExhaustedIds] = useState<QnaCategory[]>([]);

  const reduceMotion = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);

  // Posisi kontinu (satuan: kartu). Berubah tanpa re-render React.
  const position = useMotionValue(0);
  const targetRef = useRef(0); // tujuan akhir (bilangan bulat)
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const { mutate: startNewQna, isPending } = useStartNewQna();

  const selectedCategory = QNA_CATEGORIES[selectedIndex];

  useEffect(() => () => controlsRef.current?.stop(), []);

  /* ------------------------------ Engine ---------------------------------- */

  // Spring framer-motion menuju target, dengan momentum awal dari jari
  function commitTarget(rawTarget: number, velocity = 0) {
    if (TOTAL < 2) return;

    const target = LOOP ? rawTarget : clamp(rawTarget, 0, TOTAL - 1);
    targetRef.current = target;
    setSelectedIndex(mod(target, TOTAL));

    controlsRef.current?.stop();

    if (reduceMotion) {
      position.set(target);
      return;
    }

    controlsRef.current = animate(position, target, {
      type: "spring",
      stiffness: STIFFNESS,
      damping: DAMPING,
      velocity,
      restDelta: REST_DISTANCE,
      restSpeed: REST_SPEED,
    });
  }

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
  /* Pakai pan gesture bawaan framer-motion; posisi diubah langsung lewat      */
  /* MotionValue.                                                              */

  function handlePanStart(_: unknown, info: PanInfo) {
    if (isPending || TOTAL < 2) return;

    // Dominan vertikal → biarkan halaman yang scroll
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      dragRef.current = null;
      return;
    }

    // "Tangkap" kartu di posisi sekarang (kalau masih bergerak)
    controlsRef.current?.stop();

    const firstCard = stageRef.current?.firstElementChild as HTMLElement | null;

    dragRef.current = {
      startPosition: position.get(),
      startTarget: targetRef.current,
      unit: (firstCard?.offsetWidth ?? 300) * SPREAD,
    };
    suppressClickRef.current = true;
  }

  function handlePan(_: unknown, info: PanInfo) {
    const drag = dragRef.current;
    if (!drag) return;

    // Jari geser ke kiri → posisi bertambah → kartu berikutnya masuk
    const delta = softLimit(-info.offset.x / drag.unit);
    position.set(bound(drag.startPosition + delta));
  }

  function handlePanEnd(_: unknown, info: PanInfo) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;

    // Abaikan click susulan setelah drag
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);

    const pxPerSecond = info.velocity.x;
    const velocity = -pxPerSecond / drag.unit; // kartu / detik
    const moved = position.get() - drag.startPosition; // kartu

    let direction = 0;
    if (Math.abs(pxPerSecond) > FLICK_PX_PER_SEC) {
      direction = Math.sign(velocity);
    } else if (Math.abs(moved) > SNAP_DISTANCE) {
      direction = Math.sign(moved);
    }

    commitTarget(
      drag.startTarget + direction,
      clamp(velocity, -MAX_RELEASE_SPEED, MAX_RELEASE_SPEED),
    );
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
      <motion.div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Pilih kategori"
        className="relative isolate h-[400px] w-full touch-pan-y select-none overflow-visible [-webkit-tap-highlight-color:transparent]"
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
      >
        {QNA_CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            position={position}
            isLoading={isPending && index === selectedIndex}
            isExhausted={exhaustedIds.includes(category.id)}
            disabled={isPending}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </motion.div>

      {/* Navigation */}
      <div className="mt-1 flex items-center justify-center gap-5">
        <button
          type="button"
          disabled={isPending}
          onClick={goPrevious}
          aria-label="Kategori sebelumnya"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={goNext}
          aria-label="Kategori berikutnya"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight size={14} />
        </button>
      </div>

      <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
        Swipe to change
      </p>
    </div>
  );
}