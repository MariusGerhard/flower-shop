import { Provider, computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Bouquet } from '../app/shared/models/bouquet.model';
import { Order } from '../app/shared/models/order.model';
import { UserModel } from '../app/shared/models/user.model';
import { FirebaseService } from '../app/shared/services/firebase.service';
import { UiService } from '../app/shared/services/ui.service';

/** Test double for FirebaseService: same signals, all methods are vi.fn(). */
export function createFirebaseMock() {
  const authUser = signal<{ uid: string } | null>(null);
  const profile = signal<UserModel | null>(null);
  return {
    authUser,
    profile,
    isAuth: computed(() => authUser() !== null),
    userRole: computed(() => profile()?.role ?? null),
    authReady: Promise.resolve(),

    registerUser: vi.fn().mockResolvedValue(undefined),
    loginUser: vi.fn().mockResolvedValue(undefined),
    loginGoogle: vi.fn().mockResolvedValue(undefined),
    loginFacebook: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
    logoutUser: vi.fn().mockResolvedValue(undefined),

    watchUsers: vi.fn(() => of([] as UserModel[])),
    updateUser: vi.fn().mockResolvedValue(undefined),
    deleteUser: vi.fn().mockResolvedValue(undefined),

    watchBouquets: vi.fn(() => of([] as Bouquet[])),
    addBouquet: vi.fn().mockResolvedValue(undefined),
    updateBouquet: vi.fn().mockResolvedValue(undefined),
    deleteBouquet: vi.fn().mockResolvedValue(undefined),
    getPictureUrl: vi.fn().mockResolvedValue('https://example.test/pic.jpg'),
    deleteBouquetPicture: vi.fn().mockResolvedValue(undefined),

    watchFlowers: vi.fn(() => of([] as { id: string; name: string; color: string; price: number }[])),
    watchOrders: vi.fn(() => of([] as Order[])),
    watchUserOrders: vi.fn(() => of([] as Order[])),
    placeOrder: vi.fn().mockResolvedValue(undefined),
  };
}

export type FirebaseMock = ReturnType<typeof createFirebaseMock>;

export function createUiMock() {
  return { showSnackbar: vi.fn(), showError: vi.fn(), notify: vi.fn() };
}

export type UiMock = ReturnType<typeof createUiMock>;

export function provideFirebaseMock(firebase: FirebaseMock, ui: UiMock = createUiMock()): Provider[] {
  return [
    { provide: FirebaseService, useValue: firebase },
    { provide: UiService, useValue: ui },
  ];
}

export function testUser(overrides: Partial<UserModel> = {}): UserModel {
  return {
    id: 'user-1',
    authId: 'auth-1',
    gender: 'Mrs.',
    firstName: 'Anna',
    lastName: 'Blume',
    email: 'anna@example.test',
    birth: new Date(1990, 4, 17),
    role: 'user',
    countOrders: 2,
    ...overrides,
  };
}
