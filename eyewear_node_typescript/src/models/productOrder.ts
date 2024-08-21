import { Schema, model } from 'mongoose';
import { ProductOrder } from '../interfaces/models';

const productOrderSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: 1,
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

export default model<ProductOrder>('Product_Order', productOrderSchema);
