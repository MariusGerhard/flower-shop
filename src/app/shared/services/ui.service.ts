import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { I18nService } from '../../i18n/i18n.service';
import { TranslationKey, TranslationParams } from '../../i18n/i18n.types';
import { firebaseErrorKey } from '../firebase-errors';

@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly snackbar = inject(MatSnackBar);
  private readonly i18n = inject(I18nService);

  showSnackbar(message: string, action?: string, duration = 2000): void {
    this.snackbar.open(message, action, {
      duration,
      panelClass: ['snackbar'],
    });
  }

  /** Shows a translated message, e.g. `notify('auth.loginSuccessful')`. */
  notify(key: TranslationKey, params?: TranslationParams, duration = 2500): void {
    this.showSnackbar(this.i18n.t(key, params), undefined, duration);
  }

  /**
   * Shows an understandable, translated message for an error (e.g. a Firebase error) and logs the original.
   * @param context optional first sentence, e.g. 'myOrders.loadFailed'
   */
  showError(error: unknown, context?: TranslationKey, params?: TranslationParams): void {
    console.error(error);
    const message = this.i18n.t(firebaseErrorKey(error));
    this.showSnackbar(context ? `${this.i18n.t(context, params)} ${message}` : message, undefined, 4000);
  }
}
