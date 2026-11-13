import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { FirebaseMock, createFirebaseMock, provideFirebaseMock } from '../../../testing/firebase-mock';
import { Register } from './register';

describe('Register', () => {
  let firebase: FirebaseMock;

  const form = (value: Record<string, unknown>) => ({ value }) as NgForm;
  const formValue = {
    gender: 'Mrs.',
    firstName: 'Anna',
    lastName: 'Blume',
    email: 'anna@example.test',
    password: 'supersecret',
    birthdate: new Date(1990, 4, 17),
    conditions: true,
  };

  beforeEach(() => {
    firebase = createFirebaseMock();
    TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideNativeDateAdapter(), ...provideFirebaseMock(firebase)],
    });
  });

  it('renders all form fields and starts with a disabled Submit', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    for (const name of ['firstName', 'lastName', 'email', 'password', 'birthdate']) {
      expect(el.querySelector(`input[name="${name}"]`), name).not.toBeNull();
    }
    expect(el.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
  });

  it('registers the user with the form values', async () => {
    const component = TestBed.createComponent(Register).componentInstance;

    await component['onSubmit'](form(formValue));

    expect(firebase.registerUser).toHaveBeenCalledWith({
      email: 'anna@example.test',
      password: 'supersecret',
      gender: 'Mrs.',
      firstName: 'Anna',
      lastName: 'Blume',
      birth: formValue.birthdate,
    });
    expect(component['isLoading']()).toBe(false);
  });

  it('resets the loading state when registration fails', async () => {
    firebase.registerUser.mockRejectedValue(new Error('email-already-in-use'));
    const component = TestBed.createComponent(Register).componentInstance;

    await component['onSubmit'](form(formValue));

    expect(component['isLoading']()).toBe(false);
  });
});
