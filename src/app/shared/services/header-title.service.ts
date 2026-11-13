import { Injectable, signal } from '@angular/core';

import { TranslationKey } from '../../i18n/i18n.types';

/** Title of the current page as translation key (shown in the header). */
@Injectable({ providedIn: 'root' })
export class HeaderTitleService {
  private readonly _title = signal<TranslationKey>('titles.home');
  readonly title = this._title.asReadonly();

  setTitle(title: TranslationKey): void {
    this._title.set(title);
  }
}
