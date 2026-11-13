import { TranslationKey } from '../i18n/i18n.types';

/** Translation keys for Firebase error codes (Auth, Firestore, Storage). */
const MESSAGES: Record<string, TranslationKey> = {
  // Auth: login
  'auth/invalid-credential': 'errors.wrongCredentials',
  'auth/wrong-password': 'errors.wrongCredentials',
  'auth/user-not-found': 'errors.wrongCredentials',
  'auth/invalid-email': 'errors.invalidEmail',
  'auth/user-disabled': 'errors.userDisabled',
  'auth/too-many-requests': 'errors.tooManyRequests',
  // Auth: registration
  'auth/email-already-in-use': 'errors.emailInUse',
  'auth/weak-password': 'errors.weakPassword',
  // Auth: Google / Facebook popup
  'auth/popup-closed-by-user': 'errors.popupClosed',
  'auth/cancelled-popup-request': 'errors.popupClosed',
  'auth/popup-blocked': 'errors.popupBlocked',
  'auth/account-exists-with-different-credential': 'errors.differentCredential',
  'auth/operation-not-allowed': 'errors.operationNotAllowed',
  'auth/unauthorized-domain': 'errors.unauthorizedDomain',
  // Setup
  'auth/invalid-api-key': 'errors.invalidApiKey',
  'auth/api-key-not-valid': 'errors.invalidApiKey',
  // Network
  'auth/network-request-failed': 'errors.network',
  unavailable: 'errors.unavailable',
  'deadline-exceeded': 'errors.deadlineExceeded',
  // Firestore / Storage
  'permission-denied': 'errors.permissionDenied',
  'storage/unauthorized': 'errors.permissionDenied',
  unauthenticated: 'errors.unauthenticated',
  'storage/object-not-found': 'errors.pictureNotFound',
  'not-found': 'errors.notFound',
};

/** Returns the Firebase error code (e.g. "auth/wrong-password"), if the error has one. */
export function firebaseErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

/** Translation key with a short, understandable message for any error. */
export function firebaseErrorKey(error: unknown): TranslationKey {
  const code = firebaseErrorCode(error);
  if (!code) {
    return 'errors.fallback';
  }
  // Some codes carry extra text, e.g. "auth/api-key-not-valid.-please-pass-a-valid-api-key."
  const known = Object.keys(MESSAGES).find((key) => code === key || code.startsWith(`${key}.`));
  return known ? MESSAGES[known] : 'errors.fallback';
}
