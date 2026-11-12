import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  FirebaseMock,
  UiMock,
  createFirebaseMock,
  createUiMock,
  provideFirebaseMock,
  testUser,
} from '../../../testing/firebase-mock';
import { Profile } from './profile';

describe('Profile', () => {
  let firebase: FirebaseMock;
  let ui: UiMock;

  beforeEach(() => {
    firebase = createFirebaseMock();
    ui = createUiMock();
    TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideRouter([]), provideNativeDateAdapter(), ...provideFirebaseMock(firebase, ui)],
    });
  });

  it('shows a progress bar until the profile is loaded', async () => {
    const fixture = TestBed.createComponent(Profile);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).not.toBeNull();
  });

  it('shows the profile data read-only until Edit is clicked', async () => {
    firebase.profile.set(testUser());
    const fixture = TestBed.createComponent(Profile);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const firstName = el.querySelector<HTMLInputElement>('input[name="firstName"]')!;

    expect(firstName.value).toBe('Anna');
    expect(firstName.disabled).toBe(true);
    expect(el.textContent).toContain('Number of Orders: 2');

    const editButton = Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
      b.textContent?.includes('Edit Settings'),
    )!;
    editButton.click();
    await fixture.whenStable();

    expect(firstName.disabled).toBe(false);
    expect(editButton.textContent).toContain('Stop Edit');
  });

  it('saves the changes on the user document and goes back to the shop', async () => {
    firebase.profile.set(testUser());
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const component = TestBed.createComponent(Profile).componentInstance;
    const birth = new Date(1991, 0, 1);

    await component['onSubmit']({
      value: { gender: 'Mrs.', firstName: 'Anne', lastName: 'Blume', birth },
    } as NgForm);

    expect(firebase.updateUser).toHaveBeenCalledWith('user-1', {
      gender: 'Mrs.',
      firstName: 'Anne',
      lastName: 'Blume',
      birth,
    });
    expect(ui.showSnackbar).toHaveBeenCalledWith('Anne Blume was updated', undefined, 2500);
    expect(navigate).toHaveBeenCalledWith(['/shop']);
  });
});
