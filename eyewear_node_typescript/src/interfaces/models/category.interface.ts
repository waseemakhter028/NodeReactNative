import Document from '../db.interface';

export default interface Category extends Document {
  name: string;
  status: number;
}
