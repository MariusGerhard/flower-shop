import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderTitleService } from '../../shared/services/header-title.service';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Footer], providers: [provideRouter([])] });
  });

  it('links to the legal notice', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('a[href="/notice"]')).not.toBeNull();
  });

  it('hides the link while the legal notice is shown', async () => {
    const fixture = TestBed.createComponent(Footer);
    await fixture.whenStable();

    TestBed.inject(HeaderTitleService).setTitle('Legal-Notice');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('a[href="/notice"]')).toBeNull();
  });
});
