export class Bouquet {
  // tslint:disable-next-line:variable-name
  _id: string;
  name: string;
  category: string;
  description: string | null;
  flower: string;
  seasonStart: number;
  seasonEnd: number;
  price: number;
  path?: string;
}
