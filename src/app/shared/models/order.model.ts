import { TranslationKey } from '../../i18n/i18n.types';

export interface Order {
  /** Firestore document id (not stored in the document) */
  id?: string;
  userId: string;
  userName: string;
  bouquetId: string;
  bouquetName: string;
  price: number;
  orderDate: string;
  pickUpDate: string;
  event?: string;
  message?: string;
}

/** Special events for an order: `value` is stored (English, unchanged), `label` is translated. */
export const ORDER_EVENTS: readonly { value: string; label: TranslationKey }[] = [
  { value: 'Birthday', label: 'bouquets.events.birthday' },
  { value: 'Mothers Day', label: 'bouquets.events.mothersDay' },
  { value: 'Christmas', label: 'bouquets.events.christmas' },
  { value: 'Easter', label: 'bouquets.events.easter' },
];

/** Translation key for a stored event value, or null for unknown values. */
export function orderEventLabel(value: string): TranslationKey | null {
  return ORDER_EVENTS.find((e) => e.value === value)?.label ?? null;
}
