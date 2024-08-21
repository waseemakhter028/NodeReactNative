import { Schema, model } from 'mongoose';
import { OrderCoupon } from '../interfaces/models';

const orderCouponSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    user_coupon_id: {
      type: Schema.Types.ObjectId,
      ref: 'User_Coupon',
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true, strict: true },
);

export default model<OrderCoupon>('Order_Coupon', orderCouponSchema);
