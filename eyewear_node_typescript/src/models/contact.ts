import { Schema, model } from 'mongoose';
import { Contact } from '../interfaces/models';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: true },
);

export default model<Contact>('Contact', contactSchema);
