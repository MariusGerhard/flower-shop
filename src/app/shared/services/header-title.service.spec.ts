import { TestBed } from '@angular/core/testing';

import { HeaderTitleService } from './header-title.service';

describe('HeaderTitleService', () => {
  it('starts with "Home" and updates the title signal', () => {
    const service = TestBed.inject(HeaderTitleService);
    expect(service.title()).toBe('Home');

    service.setTitle('Bouquets');

    expect(service.title()).toBe('Bouquets');
  });
});
