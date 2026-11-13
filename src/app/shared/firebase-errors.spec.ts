import { FirebaseError } from 'firebase/app';

import { firebaseErrorCode, firebaseErrorKey } from './firebase-errors';

describe('firebaseErrorKey', () => {
  it.each([
    ['auth/invalid-credential', 'errors.wrongCredentials'],
    ['auth/wrong-password', 'errors.wrongCredentials'],
    ['auth/user-not-found', 'errors.wrongCredentials'],
    ['auth/email-already-in-use', 'errors.emailInUse'],
    ['auth/weak-password', 'errors.weakPassword'],
    ['auth/too-many-requests', 'errors.tooManyRequests'],
    ['auth/popup-closed-by-user', 'errors.popupClosed'],
    ['auth/network-request-failed', 'errors.network'],
    ['permission-denied', 'errors.permissionDenied'],
    ['storage/unauthorized', 'errors.permissionDenied'],
  ])('maps %s to %s', (code, key) => {
    expect(firebaseErrorKey(new FirebaseError(code, 'Firebase: raw text'))).toBe(key);
  });

  it('understands codes with extra text after a dot', () => {
    const error = new FirebaseError('auth/api-key-not-valid.-please-pass-a-valid-api-key.', 'raw');

    expect(firebaseErrorKey(error)).toBe('errors.invalidApiKey');
  });

  it('never exposes the raw Firebase text for unknown codes', () => {
    expect(firebaseErrorKey(new FirebaseError('auth/something-new', 'Firebase: Error (x).'))).toBe('errors.fallback');
  });

  it('falls back for errors without a code', () => {
    expect(firebaseErrorKey(new Error('boom'))).toBe('errors.fallback');
    expect(firebaseErrorKey('boom')).toBe('errors.fallback');
    expect(firebaseErrorKey(null)).toBe('errors.fallback');
  });

  it('does not match a code that only starts with a known prefix', () => {
    expect(firebaseErrorKey({ code: 'auth/weak-password-extra' })).toBe('errors.fallback');
  });
});

describe('firebaseErrorCode', () => {
  it('reads the code of Firebase-like errors', () => {
    expect(firebaseErrorCode(new FirebaseError('auth/user-disabled', 'x'))).toBe('auth/user-disabled');
    expect(firebaseErrorCode({ code: 'permission-denied' })).toBe('permission-denied');
  });

  it('returns null for everything else', () => {
    expect(firebaseErrorCode(new Error('x'))).toBeNull();
    expect(firebaseErrorCode({ code: 42 })).toBeNull();
    expect(firebaseErrorCode(undefined)).toBeNull();
  });
});
