import { Schema, model } from 'mongoose';
import { Transaction } from '../interfaces/models';

const transactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    total_amount: {
      type: Number,
    },
    transaction_detail: {
      type: Object,
      default: null,
    },
    payment_method: {
      type: String,
      trim: true,
      default: 'razorpay', // razorpay / coupon
    },
    status: {
      type: String,
      default: 'paid',
    },
  },
  { timestamps: true, strict: true },
);

export default model<Transaction>('Transaction', transactionSchema);
