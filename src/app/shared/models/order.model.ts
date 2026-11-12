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
