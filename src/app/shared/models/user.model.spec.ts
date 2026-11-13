import { Timestamp } from 'firebase/firestore';

import { birthdateRange, toDate } from './user.model';

describe('toDate', () => {
  it('returns null for empty values', () => {
    expect(toDate(null)).toBeNull();
    expect(toDate(undefined)).toBeNull();
    expect(toDate('')).toBeNull();
  });

  it('returns a Date unchanged', () => {
    const date = new Date(2000, 0, 1);
    expect(toDate(date)).toBe(date);
  });

  it('converts a Firestore Timestamp', () => {
    const date = new Date(1990, 4, 17, 12, 0, 0);
    expect(toDate(Timestamp.fromDate(date))?.getTime()).toBe(date.getTime());
  });

  it('converts a legacy {seconds} object', () => {
    expect(toDate({ seconds: 86400 })?.toISOString()).toBe('1970-01-02T00:00:00.000Z');
  });

  it('returns null for unknown shapes', () => {
    expect(toDate({ foo: 1 })).toBeNull();
  });
});

describe('birthdateRange', () => {
  afterEach(() => vi.useRealTimers());

  it('allows ages between 16 and 116 years', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 12));

    const { min, max } = birthdateRange();

    expect(max.getFullYear()).toBe(2010);
    expect(max.getMonth()).toBe(10);
    expect(max.getDate()).toBe(12);
    expect(min.getFullYear()).toBe(1910);
  });
});
