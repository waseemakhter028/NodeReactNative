import { TransactionDetail } from './transactionDetail.interface';
import { Address } from './models/index';

export interface JWTDecodeToken {
  email: string;
  userId: string;
  iat: number;
  exp: number;
}

export interface Attachment {
  filename: string;
  filepath: string;
  contentType: string;
}
[];

export interface Pagination {
  offset: number;
  limit: number;
}

export interface CouponData {
  title: string;
  code: string;
  description: string;
  amount: number;
  validity: string;
}

export interface InsertCouponLog {
  id: string;
  user_id: string;
  order_id: string;
}

export interface InsertTransaction {
  user_id: string;
  total_amount: number;
  payment_method: string;
  status: string;
}

interface PaymentType {
  payment_type: string;
}

export interface InsertOrder {
  user_id: string;
  transaction_id: string;
  transaction_detail: TransactionDetail | PaymentType;
  notes: string;
  address_id: string;
  payment_method: string;
  delivery_charge: number;
}

export interface Subtotal {
  id: string;
  image: string;
  name: string;
  price: number;
  user_id: string;
  product_id: string;
  quantity: number;
}

export interface CheckoutInfo {
  cart: Subtotal[];
  coupon: CouponData[];
  delivery_charge: number;
  address: Address[];
}
