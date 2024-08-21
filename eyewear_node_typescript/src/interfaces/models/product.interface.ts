import Document from '../db.interface';

export default interface Product extends Document {
  image: string;
  name: string;
  price: number;
  category: string;
  information: string;
  qty: number;
  status: number;
}
