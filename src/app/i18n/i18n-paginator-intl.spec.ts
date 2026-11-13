import { TestBed } from '@angular/core/testing';

import { I18nPaginatorIntl } from './i18n-paginator-intl';
import { I18nService } from './i18n.service';

describe('I18nPaginatorIntl', () => {
  let i18n: I18nService;
  let intl: I18nPaginatorIntl;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [I18nPaginatorIntl] });
    i18n = TestBed.inject(I18nService);
    i18n.setLanguage('en');
    intl = TestBed.inject(I18nPaginatorIntl);
    TestBed.tick();
  });

  it('shows English labels and ranges', () => {
    expect(intl.itemsPerPageLabel).toBe('Items per page:');
    expect(intl.getRangeLabel(1, 5, 12)).toBe('6 – 10 of 12');
    expect(intl.getRangeLabel(2, 5, 12)).toBe('11 – 12 of 12');
    expect(intl.getRangeLabel(0, 5, 0)).toBe('0 of 0');
  });

  it('switches to German and tells the paginators to update', () => {
    const changed = vi.fn();
    intl.changes.subscribe(changed);

    i18n.setLanguage('de');
    TestBed.tick();

    expect(intl.itemsPerPageLabel).toBe('Einträge pro Seite:');
    expect(intl.nextPageLabel).toBe('Nächste Seite');
    expect(intl.getRangeLabel(0, 5, 12)).toBe('1 – 5 von 12');
    expect(changed).toHaveBeenCalled();
  });
});
