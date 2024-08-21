import Document from '../db.interface';
import { User } from './index';

export default interface Transaction extends Document {
  user_id: User;
  total_amount: number;
  transaction_detail: object | null;
  payment_method: string;
  status: number;
}
