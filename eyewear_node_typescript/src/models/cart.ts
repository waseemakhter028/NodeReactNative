import mongoose, { Schema, model } from 'mongoose';
import { Cart } from '../interfaces/models';

const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      required: true,
    },
    size: {
      type: String,
      default: 'M',
    },
    color: {
      type: String,
      default: '#B11D1D',
    },
  },
  { timestamps: true, strict: true },
);

cartSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

cartSchema.set('toJSON', {
  virtuals: true,
});

export default model<Cart>('Cart', cartSchema);
