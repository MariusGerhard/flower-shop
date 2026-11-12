export interface Bouquet {
  /** Firestore document id */
  id: string;
  name: string;
  category: string;
  description: string | null;
  flower: string;
  seasonStart: number;
  seasonEnd: number;
  price: number;
  /** Optional path of a picture in Firebase Storage */
  path?: string | null;
}

export type BouquetInput = Omit<Bouquet, 'id'>;

/** Search criteria: only one of the fields is used (name, then category, then flower). */
export interface BouquetFilter {
  name?: string;
  category?: string;
  flower?: string;
}
