import Document from '../db.interface';
import { Order, Product } from './index';

export default interface ProductOrder extends Document {
  order_id: Order;
  product_id: Product;
  price: number;
  quantity: number;
  size: string;
  color: string;
}
