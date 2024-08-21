import { Schema, model } from 'mongoose';
import { Category } from '../interfaces/models';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
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

export default model<Category>('Category', categorySchema);
