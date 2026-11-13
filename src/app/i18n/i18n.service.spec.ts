import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { de } from './translations/de';
import { en } from './translations/en';

const STORAGE_KEY = 'flower-shop.language';

/** All leaf paths of a nested text object, e.g. "login.title" */
function keys(node: object, prefix = ''): string[] {
  return Object.entries(node).flatMap(([k, v]) =>
    typeof v === 'string' ? [`${prefix}${k}`] : keys(v as object, `${prefix}${k}.`),
  );
}

describe('I18nService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('uses English for an English browser', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');

    const i18n = TestBed.inject(I18nService);

    expect(i18n.lang()).toBe('en');
    expect(i18n.t('nav.login')).toBe('Login');
  });

  it('uses German for a German browser', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-AT');

    expect(TestBed.inject(I18nService).lang()).toBe('de');
  });

  it('prefers the language chosen before', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    localStorage.setItem(STORAGE_KEY, 'de');

    expect(TestBed.inject(I18nService).lang()).toBe('de');
  });

  it('ignores invalid stored values', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    localStorage.setItem(STORAGE_KEY, 'fr');

    expect(TestBed.inject(I18nService).lang()).toBe('en');
  });

  it('switches texts, locale, <html lang> and remembers the choice', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    const i18n = TestBed.inject(I18nService);

    i18n.setLanguage('de');
    TestBed.tick();

    expect(i18n.t('nav.login')).toBe('Anmelden');
    expect(i18n.locale()).toBe('de-DE');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('de');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('de');
  });

  it('fills in placeholders', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('en');

    expect(i18n.t('bouquets.available', { start: 3, end: 5 })).toBe('Available between 3 and 5');
    expect(i18n.t('paginator.range', { start: 1, end: 5, total: 12 })).toBe('1 – 5 of 12');
  });

  it('leaves unknown placeholders untouched', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('en');

    expect(i18n.t('profile.updated', {})).toBe('{name} was updated');
  });

  it('keeps working when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const i18n = TestBed.inject(I18nService);

    i18n.setLanguage('de');
    TestBed.tick();

    expect(i18n.lang()).toBe('de');
  });
});

describe('translations', () => {
  it('German has exactly the same keys as English', () => {
    expect(keys(de).sort()).toEqual(keys(en).sort());
  });

  it('has no empty texts', () => {
    const empty = [...keys(en).map((k) => ['en', k]), ...keys(de).map((k) => ['de', k])].filter(([lang, key]) => {
      const value = key.split('.').reduce<any>((node, part) => node[part], lang === 'de' ? de : en);
      return !String(value).trim();
    });
    expect(empty).toEqual([]);
  });

  it('uses the same placeholders in both languages', () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(',');
    const lookup = (dict: object, key: string) => key.split('.').reduce<any>((node, part) => node[part], dict);

    const mismatches = keys(en).filter((key) => placeholders(lookup(en, key)) !== placeholders(lookup(de, key)));

    expect(mismatches).toEqual([]);
  });
});
