// screen-time/components/tier-icon.tsx

"use client";

import type { IconTheme } from "../types";

interface TierIconProps {
  level: number;
  theme: IconTheme;
  size?: number;
  className?: string;
}

const clampLevel = (level: number) => Math.min(7, Math.max(1, level));

const themeColors: Record<IconTheme, string> = {
  flame: "#f97316",
  heart: "#ec4899",
  star: "#eab308",
  moon: "#818cf8",
};

export function TierIcon({ level, theme, size = 48, className = "" }: TierIconProps) {
  const currentLevel = clampLevel(level);
  const color = themeColors[theme];

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {theme === "flame" && <FlameIcon level={currentLevel} color={color} />}
        {theme === "heart" && <HeartIcon level={currentLevel} color={color} />}
        {theme === "star" && <StarIcon level={currentLevel} color={color} />}
        {theme === "moon" && <MoonIcon level={currentLevel} color={color} />}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FLAME                                                                       */
/* -------------------------------------------------------------------------- */

function FlameIcon({ level, color }: { level: number; color: string }) {
  const glow = level >= 5;

  if (level === 1) {
    return (
      <>
        <path d="M32 52C24.5 52 19 47.3 19 40.5C19 35.2 22.1 31.1 27.1 27.5C26.9 32 29.1 34.3 31.1 35.3C30.8 30.2 32.9 25.6 37.1 21C36.7 28.1 45 32.5 45 40.5C45 47.3 39.5 52 32 52Z" fill={color} opacity="0.72" />
        <path d="M32 46C28.5 46 26 43.8 26 40.6C26 38.4 27.2 36.6 29.3 34.9C29.4 38 31.1 39.2 32.7 39.8C32.3 36.6 33.8 34.8 35.5 33.1C35.4 37.6 39 39.1 39 42C39 44.6 36.2 46 32 46Z" fill="white" opacity="0.72" />
      </>
    );
  }

  if (level === 2) {
    return (
      <>
        <path d="M32 54C22.8 54 16 48.1 16 39.5C16 32.8 20.2 27.5 26.7 22.7C26.3 29.4 29 32.3 31.5 33.6C31 26.3 34.2 20.4 40.1 14C39.4 23.9 48 29.1 48 39.5C48 48.1 41.2 54 32 54Z" fill={color} />
        <path d="M32 48C27.4 48 24 45 24 40.8C24 37.8 25.8 35.4 29 32.9C29 37 31 39 33 39.8C32.5 36.2 34 33.8 36.5 31.2C36.5 36.4 41 38.2 41 42C41 45.7 37.4 48 32 48Z" fill="white" opacity="0.7" />
      </>
    );
  }

  if (level === 3) {
    return (
      <>
        <path d="M32 55C21.8 55 14 48.5 14 39C14 31.5 18.8 25.4 25.8 20.2C25.1 28 28.6 31.2 31.4 32.6C30.8 24.5 34.2 17.7 41.2 10C40.4 22.1 50 28.2 50 39C50 48.5 42.2 55 32 55Z" fill={color} />
        <path d="M32 48C27 48 23 44.8 23 40.2C23 36.9 25.1 34.1 29 31.2C29 36.1 31.2 38.3 33.3 39.2C32.8 35.1 34.7 32.3 37.5 29.3C37.4 35.2 42 37.4 42 41.7C42 45.6 38.2 48 32 48Z" fill="white" opacity="0.78" />
      </>
    );
  }

  if (level === 4) {
    return (
      <>
        <path d="M32 56C20.5 56 12 48.7 12 38.6C12 30.5 17.5 23.8 25.5 18.1C24.7 27.1 28.6 30.8 31.8 32.4C31.2 23.2 35.1 15.3 43.3 6C42.3 20.5 52 27.8 52 38.6C52 48.7 43.5 56 32 56Z" fill={color} />
        <path d="M32 49C26.5 49 22 45.4 22 40.4C22 36.6 24.5 33.4 29 30.2C28.9 35.7 31.5 38.2 33.8 39.2C33.2 34.6 35.3 31.4 38.4 28.1C38.3 34.8 43 37.2 43 42C43 46.2 38.8 49 32 49Z" fill="white" opacity="0.82" />
      </>
    );
  }

  if (level === 5) {
    return (
      <>
        <circle cx="32" cy="32" r="25" fill={color} opacity="0.08" />
        <circle cx="32" cy="32" r="21" fill={color} opacity="0.1" />
        <path d="M32 57C19.5 57 10 49 10 38.2C10 29.4 16.1 22 24.4 15.8C23.5 25.8 27.9 30 31.5 31.8C30.7 21.8 35.1 13 44.1 3C43 18.8 54 26.8 54 38.2C54 49 44.5 57 32 57Z" fill={color} />
        <path d="M32 50C26 50 21 46 21 40.6C21 36.4 23.8 32.9 28.9 29.3C28.8 35.5 31.6 38.3 34.1 39.3C33.4 34.1 35.8 30.5 39.3 26.8C39.2 34.2 44 37 44 42.1C44 46.7 39.2 50 32 50Z" fill="white" opacity="0.85" />
        <path d="M16 18L18 13M48 18L46 13M32 8V4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </>
    );
  }

  if (level === 6) {
    return (
      <>
        <circle cx="32" cy="32" r="27" fill={color} opacity="0.07" />
        <circle cx="32" cy="32" r="23" fill={color} opacity="0.08" />
        <path d="M32 58C18.7 58 8 49.4 8 37.8C8 28.5 14.6 20.6 23.6 14C22.7 24.8 27.4 29.5 31.3 31.4C30.5 20.7 35.2 11.3 45 0C43.8 17.2 56 25.8 56 37.8C56 49.4 45.3 58 32 58Z" fill={color} />
        <path d="M32 51C25.5 51 20 46.7 20 40.7C20 36 23 32.1 28.7 28.1C28.6 34.8 31.7 37.8 34.4 39C33.7 33.4 36.2 29.2 40.2 25.1C40 33 45 36.2 45 42C45 47 39.7 51 32 51Z" fill="white" opacity="0.88" />
        <path d="M15 16L11 12M49 16L53 12M32 7V2M20 10L17 5M44 10L47 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <circle cx="32" cy="32" r="29" fill={color} opacity="0.06" />
      <circle cx="32" cy="32" r="25" fill={color} opacity="0.08" />
      <circle cx="32" cy="32" r="21" fill={color} opacity="0.1" />
      <path d="M32 59C18 59 7 50 7 37.5C7 27.5 14 19 23.2 12C22.3 23.6 27.2 28.6 31.2 30.7C30.3 19.2 35.5 9.3 45.8 0C44.5 17.8 57 25.8 57 37.5C57 50 46 59 32 59Z" fill={color} />
      <path d="M32 52C25 52 19 47.5 19 41C19 36 22.4 31.8 28.5 27.4C28.4 34.6 31.7 37.9 34.6 39.1C33.9 33.1 36.6 28.5 40.9 24C40.8 32.5 46 35.8 46 42C46 47.4 40.4 52 32 52Z" fill="white" opacity="0.9" />
      <path d="M14 15L9 10M50 15L55 10M32 6V1M20 9L16 3M44 9L48 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1.5" fill={color} />
      <circle cx="55" cy="10" r="1.5" fill={color} />
      <circle cx="32" cy="1" r="1.5" fill={color} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* HEART                                                                       */
/* -------------------------------------------------------------------------- */

function HeartIcon({ level, color }: { level: number; color: string }) {
  if (level === 1) {
    return (
      <path
        d="M32 51C29 48.4 17 39.8 17 29.2C17 23.4 21.1 19 26.4 19C29.1 19 31.1 20.3 32 22.4C32.9 20.3 34.9 19 37.6 19C42.9 19 47 23.4 47 29.2C47 39.8 35 48.4 32 51Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    );
  }

  if (level === 2) {
    return (
      <path
        d="M32 53C28.4 49.9 15 40.4 15 28.9C15 22.6 19.5 18 25.2 18C28.3 18 30.7 19.5 32 22C33.3 19.5 35.7 18 38.8 18C44.5 18 49 22.6 49 28.9C49 40.4 35.6 49.9 32 53Z"
        fill={color}
        opacity="0.72"
      />
    );
  }

  if (level === 3) {
    return (
      <>
        <path
          d="M32 54C28.2 50.7 14 40.7 14 28.6C14 22 18.8 17 25 17C28.2 17 30.9 18.7 32 21.4C33.1 18.7 35.8 17 39 17C45.2 17 50 22 50 28.6C50 40.7 35.8 50.7 32 54Z"
          fill={color}
        />
        <path
          d="M22 27C22.7 23.5 25 21.5 28 21"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.65"
        />
      </>
    );
  }

  if (level === 4) {
    return (
      <>
        <path
          d="M32 56C27.7 52.3 12 41.4 12 28C12 20.9 17.3 15.5 24 15.5C27.7 15.5 30.6 17.3 32 20.3C33.4 17.3 36.3 15.5 40 15.5C46.7 15.5 52 20.9 52 28C52 41.4 36.3 52.3 32 56Z"
          fill={color}
        />
        <path d="M20 26C20.7 21.8 23.5 19.2 27.4 18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      </>
    );
  }

  if (level === 5) {
    return (
      <>
        <circle cx="32" cy="32" r="25" fill={color} opacity="0.07" />
        <circle cx="32" cy="32" r="21" fill={color} opacity="0.08" />
        <path
          d="M32 56C27.7 52.3 12 41.4 12 28C12 20.9 17.3 15.5 24 15.5C27.7 15.5 30.6 17.3 32 20.3C33.4 17.3 36.3 15.5 40 15.5C46.7 15.5 52 20.9 52 28C52 41.4 36.3 52.3 32 56Z"
          fill={color}
        />
        <path d="M20 26C20.7 21.8 23.5 19.2 27.4 18.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <path d="M12 20L9 17M52 20L55 17M32 9V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  if (level === 6) {
    return (
      <>
        <circle cx="32" cy="32" r="27" fill={color} opacity="0.06" />
        <circle cx="32" cy="32" r="23" fill={color} opacity="0.07" />
        <path
          d="M32 57C27.5 53.2 10 41.7 10 27.5C10 20 15.6 14 22.8 14C27 14 30 16 32 19.5C34 16 37 14 41.2 14C48.4 14 54 20 54 27.5C54 41.7 36.5 53.2 32 57Z"
          fill={color}
        />
        <path d="M18 25C18.8 20.4 22 17.5 26.2 16.8" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.78" />
        <path d="M11 17L7 13M53 17L57 13M32 8V3M19 10L16 5M45 10L48 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <circle cx="32" cy="32" r="29" fill={color} opacity="0.05" />
      <circle cx="32" cy="32" r="25" fill={color} opacity="0.07" />
      <circle cx="32" cy="32" r="21" fill={color} opacity="0.08" />
      <path
        d="M32 58C27.3 54 8 41.8 8 27C8 19 14 12.5 21.7 12.5C26.2 12.5 29.8 14.7 32 18.4C34.2 14.7 37.8 12.5 42.3 12.5C50 12.5 56 19 56 27C56 41.8 36.7 54 32 58Z"
        fill={color}
      />
      <path d="M16 24C17 18.8 20.5 16 25.2 15.2" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M10 15L5 10M54 15L59 10M32 7V1M18 9L14 3M46 9L50 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="5" cy="10" r="1.5" fill={color} />
      <circle cx="59" cy="10" r="1.5" fill={color} />
      <circle cx="32" cy="1" r="1.5" fill={color} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* STAR                                                                        */
/* -------------------------------------------------------------------------- */

function StarIcon({ level, color }: { level: number; color: string }) {
  if (level === 1) {
    return (
      <path
        d="M32 13L37.6 24.4L50 26.2L41 35L43.2 47.4L32 41.6L20.8 47.4L23 35L14 26.2L26.4 24.4L32 13Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.6"
      />
    );
  }

  if (level === 2) {
    return (
      <path
        d="M32 11L38.1 23.4L51.5 25.4L41.8 34.9L44.1 48.3L32 42L19.9 48.3L22.2 34.9L12.5 25.4L25.9 23.4L32 11Z"
        fill={color}
        opacity="0.72"
      />
    );
  }

  if (level === 3) {
    return (
      <>
        <path d="M32 9L38.8 22.7L54 24.9L43 35.6L45.6 50.7L32 43.6L18.4 50.7L21 35.6L10 24.9L25.2 22.7L32 9Z" fill={color} />
        <path d="M27 25L30 19" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      </>
    );
  }

  if (level === 4) {
    return (
      <>
        <path d="M32 7L39.6 22.2L56 24.6L44 36.3L46.8 53L32 45.1L17.2 53L20 36.3L8 24.6L24.4 22.2L32 7Z" fill={color} />
        <path d="M25 24L28.5 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.72" />
      </>
    );
  }

  if (level === 5) {
    return (
      <>
        <circle cx="32" cy="32" r="25" fill={color} opacity="0.07" />
        <path d="M32 6L39.8 21.7L57 24.2L44.5 36.4L47.5 53.7L32 45.5L16.5 53.7L19.5 36.4L7 24.2L24.2 21.7L32 6Z" fill={color} />
        <path d="M25 23L29 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.78" />
        <path d="M12 15V9M9 12H15M52 15V9M49 12H55M32 5V1" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  if (level === 6) {
    return (
      <>
        <circle cx="32" cy="32" r="27" fill={color} opacity="0.06" />
        <circle cx="32" cy="32" r="23" fill={color} opacity="0.06" />
        <path d="M32 5L40.1 21.3L58 23.9L45 36.7L48.1 54.8L32 46.2L15.9 54.8L19 36.7L6 23.9L23.9 21.3L32 5Z" fill={color} />
        <path d="M24 22L28 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.82" />
        <path d="M11 14V8M8 11H14M53 14V8M50 11H56M32 4V0M20 8L17 3M44 8L47 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <circle cx="32" cy="32" r="29" fill={color} opacity="0.05" />
      <circle cx="32" cy="32" r="25" fill={color} opacity="0.06" />
      <circle cx="32" cy="32" r="21" fill={color} opacity="0.07" />
      <path d="M32 3L40.5 20.5L60 23.3L45.8 37.2L49.2 57L32 47.5L14.8 57L18.2 37.2L4 23.3L23.5 20.5L32 3Z" fill={color} />
      <path d="M23 21L27.5 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      <path d="M10 13V7M7 10H13M54 13V7M51 10H57M32 4V0M19 8L16 3M45 8L48 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="7" cy="10" r="1.5" fill={color} />
      <circle cx="57" cy="10" r="1.5" fill={color} />
      <circle cx="32" cy="0" r="1.5" fill={color} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MOON                                                                        */
/* -------------------------------------------------------------------------- */

function MoonIcon({ level, color }: { level: number; color: string }) {
  if (level === 1) {
    return (
      <path
        d="M43.5 16.5C39.9 19.2 37.7 23.5 37.7 28.4C37.7 36.5 44.2 43 52.3 43C53.4 43 54.4 42.9 55.4 42.7C51.7 48.2 45.5 51.8 38.4 51.8C27.1 51.8 18 42.7 18 31.4C18 20.1 27.1 11 38.4 11C40.2 11 41.9 11.2 43.5 11.7"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    );
  }

  if (level === 2) {
    return (
      <path
        d="M43.7 14.3C39.6 17.4 37 22.3 37 27.8C37 36.9 44.4 44.3 53.5 44.3C54.6 44.3 55.7 44.2 56.7 43.9C53 49.7 46.5 53.5 39.1 53.5C27.2 53.5 17.5 43.8 17.5 31.9C17.5 20 27.2 10.3 39.1 10.3C40.7 10.3 42.2 10.5 43.7 10.8"
        fill={color}
        opacity="0.72"
      />
    );
  }

  if (level === 3) {
    return (
      <>
        <path d="M45 12C40.2 15.7 37 21.4 37 27.9C37 38.7 45.7 47.5 56.5 47.5C57.2 47.5 58 47.4 58.7 47.3C54.7 52.4 48.3 55.7 41.1 55.7C28.2 55.7 17.8 45.3 17.8 32.4C17.8 19.5 28.2 9.1 41.1 9.1C42.4 9.1 43.7 9.2 45 9.4" fill={color} />
        <circle cx="20" cy="16" r="1.5" fill={color} opacity="0.7" />
      </>
    );
  }

  if (level === 4) {
    return (
      <>
        <path d="M45.5 10.5C40.2 14.4 36.7 20.7 36.7 28C36.7 39.6 46.1 49 57.7 49C58.3 49 58.8 49 59.4 48.9C55.5 54.1 48.9 57.5 41.5 57.5C28.1 57.5 17.2 46.6 17.2 33.2C17.2 19.8 28.1 8.9 41.5 8.9C42.9 8.9 44.2 9 45.5 9.2" fill={color} />
        <circle cx="19" cy="15" r="1.5" fill={color} opacity="0.75" />
        <circle cx="49" cy="9" r="1" fill={color} opacity="0.7" />
      </>
    );
  }

  if (level === 5) {
    return (
      <>
        <circle cx="32" cy="32" r="25" fill={color} opacity="0.07" />
        <path d="M46.5 9C40.5 13.2 36.6 20 36.6 28C36.6 40.5 46.8 50.7 59.3 50.7C59.7 50.7 60.1 50.7 60.5 50.6C56.7 55.6 50 59 42.3 59C28.1 59 16.5 47.4 16.5 33.2C16.5 19 28.1 7.4 42.3 7.4C43.8 7.4 45.2 7.5 46.5 7.7" fill={color} />
        <circle cx="18" cy="14" r="1.5" fill={color} />
        <circle cx="51" cy="9" r="1.2" fill={color} />
        <path d="M12 26V20M9 23H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  if (level === 6) {
    return (
      <>
        <circle cx="32" cy="32" r="27" fill={color} opacity="0.06" />
        <circle cx="32" cy="32" r="23" fill={color} opacity="0.06" />
        <path d="M47.5 7.5C41.2 12 37 19.2 37 27.7C37 40.9 47.7 51.6 60.9 51.6H62C58.1 57 51.1 60.5 43.3 60.5C28.2 60.5 16 48.3 16 33.2C16 18.1 28.2 5.9 43.3 5.9C44.7 5.9 46.1 6 47.5 6.2" fill={color} />
        <circle cx="17" cy="13" r="1.5" fill={color} />
        <circle cx="52" cy="8" r="1.2" fill={color} />
        <path d="M11 26V19M7.5 22.5H14.5M50 18V13M47.5 15.5H52.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <circle cx="32" cy="32" r="29" fill={color} opacity="0.05" />
      <circle cx="32" cy="32" r="25" fill={color} opacity="0.06" />
      <circle cx="32" cy="32" r="21" fill={color} opacity="0.07" />
      <path d="M48.5 6C41.7 10.7 37.1 18.5 37.1 27.5C37.1 41.4 48.4 52.7 62.3 52.7C62.6 52.7 62.9 52.7 63.2 52.7C59.2 58 52.1 61.5 44.1 61.5C28.4 61.5 15.7 48.8 15.7 33.1C15.7 17.4 28.4 4.7 44.1 4.7C45.6 4.7 47.1 4.8 48.5 5" fill={color} />
      <circle cx="16" cy="12" r="1.5" fill={color} />
      <circle cx="53" cy="7" r="1.2" fill={color} />
      <path d="M11 25V18M7.5 21.5H14.5M51 18V11M47.5 14.5H54.5M24 9V4M21.5 6.5H26.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="7.5" cy="21.5" r="1.3" fill={color} />
      <circle cx="54.5" cy="14.5" r="1.3" fill={color} />
    </>
  );
}