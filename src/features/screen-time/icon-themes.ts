// screen-time/icon-themes.ts

import type { IconTheme } from "./types";

export interface IconThemeInfo {
  id: IconTheme;
  name: string;
  isPremium: boolean;
}

export const ICON_THEMES: IconThemeInfo[] = [
  { id: "flame", name: "Api", isPremium: false },
  { id: "heart", name: "Hati", isPremium: true },
  { id: "star", name: "Bintang", isPremium: true },
  { id: "moon", name: "Bulan", isPremium: true },
];