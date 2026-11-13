import { Injectable, effect, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { I18nService } from './i18n.service';

/** Translated labels for all mat-paginators; updates when the language changes. */
@Injectable()
export class I18nPaginatorIntl extends MatPaginatorIntl {
  private readonly i18n = inject(I18nService);

  constructor() {
    super();
    effect(() => {
      const t = this.i18n.t;
      this.i18n.lang(); // re-run on language change
      this.itemsPerPageLabel = t('paginator.itemsPerPage');
      this.nextPageLabel = t('paginator.nextPage');
      this.previousPageLabel = t('paginator.previousPage');
      this.firstPageLabel = t('paginator.firstPage');
      this.lastPageLabel = t('paginator.lastPage');
      this.changes.next();
    });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.i18n.t('paginator.rangeEmpty', { total: length });
    }
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return this.i18n.t('paginator.range', { start: start + 1, end, total: length });
  };
}
