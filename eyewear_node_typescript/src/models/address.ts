import { Schema, model } from 'mongoose';
import { Address } from '../interfaces/models';

const addressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    address_type: {
      type: String,
      trim: true,
      required: true,
    },
    street: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    zipcode: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      required: true,
    },
    landmark: {
      type: String,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      default: 'India',
    },
  },
  { timestamps: true, strict: true },
);

addressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

addressSchema.set('toJSON', {
  virtuals: true,
});

export default model<Address>('Address', addressSchema);
