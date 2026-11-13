import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { FirebaseMock, UiMock, createFirebaseMock, createUiMock, provideFirebaseMock } from '../../testing/firebase-mock';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let firebase: FirebaseMock;
  let ui: UiMock;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as Promise<boolean | UrlTree>;

  beforeEach(() => {
    firebase = createFirebaseMock();
    ui = createUiMock();
    TestBed.configureTestingModule({ providers: [provideRouter([]), ...provideFirebaseMock(firebase, ui)] });
  });

  it('lets logged-in users through', async () => {
    firebase.authUser.set({ uid: 'auth-1' });

    expect(await runGuard()).toBe(true);
    expect(ui.showSnackbar).not.toHaveBeenCalled();
  });

  it('redirects anonymous users to /login with a hint', async () => {
    const result = await runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login');
    expect(ui.notify).toHaveBeenCalledWith('auth.pleaseLogin');
  });

  it('waits until Firebase has restored the session', async () => {
    let resolve!: () => void;
    firebase.authReady = new Promise<void>((r) => (resolve = r));
    const pending = runGuard();

    firebase.authUser.set({ uid: 'auth-1' });
    resolve();

    expect(await pending).toBe(true);
  });
});
