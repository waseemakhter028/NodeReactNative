import Document from '../db.interface';

export default interface Coupon extends Document {
  title: string;
  code: string;
  description: string;
  amount: number;
  validity: string;
  status: number;
}
