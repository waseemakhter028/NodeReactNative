import Document from '../db.interface';
import { User, Product } from './index';

export default interface ProductRating extends Document {
  product_id: Product;
  user_id: User;
  rating: number;
  comment: string;
  status: number;
}
