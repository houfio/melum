import { browser, createI18n, localeFrom } from '@nanostores/i18n';
import { computed } from 'nanostores';

import { $settings } from './settings';

export const available = ['en', 'nl'] as const;
export const $locale = localeFrom(
  computed($settings, (settings) => settings.language !== 'auto' ? settings.language : undefined),
  browser({ available })
);

export const i18n = createI18n($locale, {
  get: (code) => import(`../locales/${code}.ts`).then((module) => module.default)
});
