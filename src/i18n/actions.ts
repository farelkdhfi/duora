
// action.ts

'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  isValidTimeZone,
  LOCALE_COOKIE,
  TIMEZONE_COOKIE,
  type Locale,
} from './config';

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setLocale(locale: Locale) {
  const store = await cookies();

  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
}

export async function setTimeZone(timeZone: string) {
  // Jangan simpan nilai ngawur dari client
  if (!isValidTimeZone(timeZone)) return;

  const store = await cookies();

  store.set(TIMEZONE_COOKIE, timeZone, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
}