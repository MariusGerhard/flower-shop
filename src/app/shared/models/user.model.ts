import { Timestamp } from 'firebase/firestore';

export interface UserModel {
  /** Firestore document id */
  id: string;
  /** Firebase Auth uid */
  authId: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Stored by Firestore as Timestamp; written as Date */
  birth: Timestamp | Date | null;
  role?: string;
  countOrders?: number;
}

/** Allowed birthdate range: users must be between 16 and 116 years old. */
export function birthdateRange(): { min: Date; max: Date } {
  const max = new Date();
  max.setFullYear(max.getFullYear() - 16);
  const min = new Date(max);
  min.setFullYear(max.getFullYear() - 100);
  return { min, max };
}

/** Converts the stored birth value (Timestamp, Date or legacy {seconds}) to a Date. */
export function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  const seconds = (value as { seconds?: number }).seconds;
  return typeof seconds === 'number' ? new Date(seconds * 1000) : null;
}
