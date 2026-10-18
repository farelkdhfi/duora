// config.ts

export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const TIMEZONE_COOKIE = 'NEXT_TIMEZONE';
export const DEFAULT_TIMEZONE = 'Asia/Jakarta';

export function isValidTimeZone(value: string | undefined): value is string {
  if (!value) return false;

  try {
    new Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}