// screen-time/use-icon-style.ts

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { ICON_THEMES } from "./components/tier-icon";
import type { IconTheme } from "./types";

export interface IconStyle {
  /** Bentuk pilihan di perangkat ini. null = ikuti tema dari server. */
  theme: IconTheme | null;
  /** Warna custom (#rrggbb). null = warna default tema. */
  color: string | null;
  animated: boolean;
}

const STORAGE_KEY = "DUONEAR:screen-time-icon-style";
const CHANGE_EVENT = "DUONEAR:icon-style-change";

const DEFAULT_STYLE: IconStyle = { theme: null, color: null, animated: true };
const HEX = /^#[0-9a-f]{6}$/i;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

const getServerSnapshot = () => "";

function parse(raw: string): IconStyle {
  if (!raw) return DEFAULT_STYLE;

  try {
    const value = JSON.parse(raw) as Partial<IconStyle>;

    return {
      theme: ICON_THEMES.includes(value.theme as IconTheme)
        ? (value.theme as IconTheme)
        : null,
      color:
        typeof value.color === "string" && HEX.test(value.color)
          ? value.color
          : null,
      animated:
        typeof value.animated === "boolean"
          ? value.animated
          : DEFAULT_STYLE.animated,
    };
  } catch {
    return DEFAULT_STYLE;
  }
}

/**
 * Preferensi tampilan ikon screen time (bentuk, warna, animasi).
 * Disimpan di perangkat ini dan sinkron antar komponen / tab.
 *
 * Tampilan ikon: `style.theme ?? temaDariServer`.
 */
export function useIconStyle() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const style = useMemo(() => parse(raw), [raw]);

  const update = useCallback((patch: Partial<IconStyle>) => {
    const next = { ...parse(getSnapshot()), ...patch };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage penuh / diblokir: abaikan, tampilan tetap default.
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const setTheme = useCallback(
    (theme: IconTheme | null) => update({ theme }),
    [update]
  );

  const setColor = useCallback(
    (color: string | null) => update({ color }),
    [update]
  );

  const setAnimated = useCallback(
    (animated: boolean) => update({ animated }),
    [update]
  );

  return { style, setTheme, setColor, setAnimated };
}