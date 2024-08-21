import { Schema, model } from 'mongoose';
import { ProductRating } from '../interfaces/models';

const productRatingSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
    },
    comment: {
      type: String,
      trim: true,
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

export default model<ProductRating>('Product_Rating', productRatingSchema);
