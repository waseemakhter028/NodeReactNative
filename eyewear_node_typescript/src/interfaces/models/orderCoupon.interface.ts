import Document from '../db.interface';
import { User, UserCoupon, Order } from './index';

export default interface OrderCoupon extends Document {
  user_id: User;
  user_coupon_id: UserCoupon;
  order_id: Order;
}
