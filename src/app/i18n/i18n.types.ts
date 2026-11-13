import { en } from './translations/en';

export type Language = 'de' | 'en';

/** Same shape as `en`, but every text is a plain string (used to type `de`). */
type DeepStrings<T> = { [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]> };
export type Translations = DeepStrings<typeof en>;

/** All dotted keys of the texts, e.g. "login.title". Wrong keys are compile errors. */
type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];
export type TranslationKey = Leaves<typeof en>;

export type TranslationParams = Record<string, string | number>;
