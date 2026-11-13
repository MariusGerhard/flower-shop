import { TestBed } from '@angular/core/testing';

import { HeaderTitleService } from './header-title.service';

describe('HeaderTitleService', () => {
  it('starts with "Home" and updates the title signal', () => {
    const service = TestBed.inject(HeaderTitleService);
    expect(service.title()).toBe('titles.home');

    service.setTitle('titles.bouquets');

    expect(service.title()).toBe('titles.bouquets');
  });
});
