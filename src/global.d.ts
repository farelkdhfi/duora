// global.d.ts

import en from '../messages/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: 'id' | 'en'
    Messages: typeof en
  }
}