import { Schema, model } from 'mongoose';
import { Product } from '../interfaces/models';

const productSchema = new Schema(
  {
    image: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    information: {
      type: String,
      trim: true,
      required: true,
    },
    qty: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      required: true,
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

export { productSchema };

export default model<Product>('Product', productSchema);
