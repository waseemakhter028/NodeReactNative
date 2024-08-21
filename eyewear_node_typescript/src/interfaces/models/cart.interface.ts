import mongoose from 'mongoose';
import Document from '../db.interface';
import { Product } from './index';

export default interface Cart extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  product_id: Product;
  quantity: number;
  size: string;
  color: string;
}
