import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { Language, TranslationKey, TranslationParams, Translations } from './i18n.types';
import { de } from './translations/de';
import { en } from './translations/en';

const STORAGE_KEY = 'flower-shop.language';
const DICTIONARIES: Record<Language, Translations> = { de, en };
const LOCALES: Record<Language, string> = { de: 'de-DE', en: 'en-US' };

/** Current language as a signal plus `t()` to look up texts. Reading `t()` in a template re-renders on change. */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly _lang = signal<Language>(this.initialLanguage());

  readonly lang = this._lang.asReadonly();
  /** Locale for date, number and currency pipes, e.g. "de-DE". */
  readonly locale = computed(() => LOCALES[this._lang()]);
  readonly languages: readonly Language[] = ['de', 'en'];

  constructor() {
    effect(() => {
      const lang = this._lang();
      this.document.documentElement.lang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage can be blocked (private mode); the choice then only lasts for this visit.
      }
    });
  }

  setLanguage(lang: Language): void {
    this._lang.set(lang);
  }

  /** Text for a key in the current language; `{name}` placeholders are replaced from `params`. */
  readonly t = (key: TranslationKey, params?: TranslationParams): string => {
    const text = lookup(DICTIONARIES[this._lang()], key) ?? lookup(en, key) ?? key;
    if (!params) {
      return text;
    }
    return text.replace(/\{(\w+)\}/g, (match, name: string) =>
      params[name] !== undefined ? String(params[name]) : match,
    );
  };

  private initialLanguage(): Language {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
    } catch {
      // ignore, fall back to the browser language
    }
    return this.document.defaultView?.navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
  }
}

function lookup(dictionary: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>(
    (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
    dictionary,
  );
  return typeof value === 'string' ? value : undefined;
}
