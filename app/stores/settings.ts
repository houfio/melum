import { persistentMap } from '@nanostores/persistent';

import type { available } from './i18n';

type Settings = {
  theme: 'auto' | 'dark' | 'light',
  language: 'auto' | typeof available[number]
};

export const $settings = persistentMap<Settings>('settings:', {
  theme: 'auto',
  language: 'auto'
});
