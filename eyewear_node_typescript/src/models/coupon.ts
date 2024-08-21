import { Schema, model } from 'mongoose';
import { Coupon } from '../interfaces/models';

const couponSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      trim: true,
      default: null,
    },
    validity: {
      type: Date,
      default: null,
    },
    status: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: 1,
    },
  },
  { timestamps: true, strict: true },
);

export default model<Coupon>('Coupon', couponSchema);
