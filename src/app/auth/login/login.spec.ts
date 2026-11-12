import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FirebaseMock, createFirebaseMock, provideFirebaseMock } from '../../../testing/firebase-mock';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { Login } from './login';

describe('Login', () => {
  let firebase: FirebaseMock;
  let fixture: ComponentFixture<Login>;
  let el: HTMLElement;

  const type = (name: string, value: string) => {
    const input = el.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submitButton = () => el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  beforeEach(async () => {
    firebase = createFirebaseMock();
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), ...provideFirebaseMock(firebase)],
    });
    fixture = TestBed.createComponent(Login);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('sets the header title', () => {
    expect(TestBed.inject(HeaderTitleService).title()).toBe('Login');
  });

  it('keeps Submit disabled until e-mail and password are valid', async () => {
    expect(submitButton().disabled).toBe(true);

    type('email', 'not-an-email');
    type('password', 'secret');
    await fixture.whenStable();
    expect(submitButton().disabled).toBe(true);

    type('email', 'anna@example.test');
    await fixture.whenStable();
    expect(submitButton().disabled).toBe(false);
  });

  it('logs in with the entered credentials', async () => {
    type('email', 'anna@example.test');
    type('password', 'secret');
    await fixture.whenStable();

    submitButton().click();
    await fixture.whenStable();

    expect(firebase.loginUser).toHaveBeenCalledWith({ email: 'anna@example.test', password: 'secret' });
  });

  it('hides the progress bar again when login fails', async () => {
    firebase.loginUser.mockRejectedValue(new Error('wrong password'));
    type('email', 'anna@example.test');
    type('password', 'wrong');
    await fixture.whenStable();

    submitButton().click();
    await fixture.whenStable();

    expect(el.querySelector('mat-progress-bar')).toBeNull();
    expect(submitButton().disabled).toBe(false);
  });

  it('uses the matching social login', async () => {
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    buttons.find((b) => b.textContent?.includes('Google'))!.click();
    buttons.find((b) => b.textContent?.includes('Facebook'))!.click();
    await fixture.whenStable();

    expect(firebase.loginGoogle).toHaveBeenCalledOnce();
    expect(firebase.loginFacebook).toHaveBeenCalledOnce();
  });
});
