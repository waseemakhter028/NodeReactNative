import { Schema, model } from 'mongoose';
import { UserCoupon } from '../interfaces/models';

const userCouponSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    coupon_id: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    coupon_amount: {
      type: Number,
      default: null,
    },
    used: {
      type: Number,
      integer: true,
      default: 0, //1=used 0=not used
    },
  },
  { timestamps: true, strict: true },
);

userCouponSchema.virtual('Coupon', {
  ref: 'Coupon',
  localField: 'coupon_id',
  foreignField: '_id',
});

export default model<UserCoupon>('User_Coupon', userCouponSchema);
