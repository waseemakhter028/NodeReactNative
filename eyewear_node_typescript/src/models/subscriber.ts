import { Schema, model } from 'mongoose';
import { Subscriber } from '../interfaces/models';

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Number,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: 1,
    },
  },
  { timestamps: true, strict: true },
);

export default model<Subscriber>('Subscriber', subscriberSchema);
