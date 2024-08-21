import Document from '../db.interface';
import { Transaction, User } from './index';
import { TransactionDetail } from '../transactionDetail.interface';

export default interface Order extends Document {
  order_id: string;
  user_id: User;
  transaction_id: Transaction;
  transaction_detail?: TransactionDetail | null;
  address_detail: object | null;
  notes: string;
  rated: number;
  delivery_charge: number;
  status: number;
}
