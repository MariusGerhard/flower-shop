import { Injectable, effect, inject } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

import { I18nService } from './i18n.service';

/**
 * Translated button labels for all datepickers; updates when the language changes.
 * (Month and day names come from the DateAdapter locale, see App.)
 */
@Injectable()
export class I18nDatepickerIntl extends MatDatepickerIntl {
  private readonly i18n = inject(I18nService);

  constructor() {
    super();
    effect(() => {
      const t = this.i18n.t;
      this.i18n.lang(); // re-run on language change
      this.calendarLabel = t('datepicker.calendar');
      this.openCalendarLabel = t('datepicker.openCalendar');
      this.closeCalendarLabel = t('datepicker.closeCalendar');
      this.prevMonthLabel = t('datepicker.prevMonth');
      this.nextMonthLabel = t('datepicker.nextMonth');
      this.prevYearLabel = t('datepicker.prevYear');
      this.nextYearLabel = t('datepicker.nextYear');
      this.prevMultiYearLabel = t('datepicker.prevMultiYear');
      this.nextMultiYearLabel = t('datepicker.nextMultiYear');
      this.switchToMonthViewLabel = t('datepicker.switchToMonthView');
      this.switchToMultiYearViewLabel = t('datepicker.switchToMultiYearView');
      this.changes.next();
    });
  }
}
