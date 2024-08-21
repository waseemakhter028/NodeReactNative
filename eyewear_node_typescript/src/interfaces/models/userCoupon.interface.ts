import Document from '../db.interface';
import { Coupon, User } from './index';

export default interface UserCoupon extends Document {
  user_id: User;
  coupon_id: Coupon;
  coupon_amount: number;
  used: number;
}
