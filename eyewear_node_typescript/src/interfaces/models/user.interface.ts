import Document from '../db.interface';
import { Address, Cart, Order, Notification } from './index';

export default interface User extends Document {
  name: string;
  email: string;
  password: string;
  email_verified_at: string;
  email_verified_status: boolean;
  api_token: string | null;
  otp: number | null;
  role: number;
  device_token: string | null;
  social_id: string | null;
  login_type: number;
  image: string | null | undefined;
  status: number;
  carts?: Cart[];
  addresses?: Address[];
  orders?: Order[];
  notifications?: Notification[];
}
