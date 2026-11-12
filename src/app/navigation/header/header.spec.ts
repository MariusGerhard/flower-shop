import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FirebaseMock, createFirebaseMock, provideFirebaseMock } from '../../../testing/firebase-mock';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { Header } from './header';

describe('Header', () => {
  let firebase: FirebaseMock;

  const linkTexts = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('.navigation-bar a')).map((a) => a.textContent?.trim());

  beforeEach(() => {
    firebase = createFirebaseMock();
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), ...provideFirebaseMock(firebase)],
    });
  });

  it('shows the current page title', async () => {
    TestBed.inject(HeaderTitleService).setTitle('Bouquets');
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.nav-item').textContent.trim()).toBe('Bouquets');
  });

  it('shows Home, Login and Register for anonymous users', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();

    expect(linkTexts(fixture.nativeElement)).toEqual(['Home', 'Login', 'Register']);
  });

  it('shows the shop links and Logout for logged-in users', async () => {
    firebase.authUser.set({ uid: 'auth-1' });
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();

    expect(linkTexts(fixture.nativeElement)).toEqual([
      'Custom',
      'Bouquets',
      'Control',
      'Profile',
      'My Orders',
      'Shop',
      'Home',
      'Logout',
    ]);
  });

  it('logs out when Logout is clicked', async () => {
    firebase.authUser.set({ uid: 'auth-1' });
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();

    const logout = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === 'Logout',
    );
    logout!.click();

    expect(firebase.logoutUser).toHaveBeenCalledOnce();
  });

  it('emits toggleNav when the menu button is clicked', async () => {
    const fixture = TestBed.createComponent(Header);
    const toggled = vi.fn();
    fixture.componentInstance.toggleNav.subscribe(toggled);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button[aria-label="Open menu"]').click();

    expect(toggled).toHaveBeenCalledOnce();
  });
});
