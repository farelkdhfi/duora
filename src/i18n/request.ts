import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import {
  DEFAULT_TIMEZONE,
  defaultLocale,
  isValidTimeZone,
  LOCALE_COOKIE,
  locales,
  TIMEZONE_COOKIE,
  type Locale,
} from './config';

export default getRequestConfig(async () => {
  const store = await cookies();

  const localeValue = store.get(LOCALE_COOKIE)?.value;
  const locale: Locale = locales.includes(localeValue as Locale)
    ? (localeValue as Locale)
    : defaultLocale;

  const timeZoneValue = store.get(TIMEZONE_COOKIE)?.value;
  const timeZone = isValidTimeZone(timeZoneValue)
    ? timeZoneValue
    : DEFAULT_TIMEZONE;

  return {
    locale,
    timeZone,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});