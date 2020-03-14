export class UserModel {
  id?: string;
  authId?: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  birth: string;
  role?: string;
  countOrders?: number;
}
