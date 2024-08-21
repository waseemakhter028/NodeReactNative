import Document from '../db.interface';

export default interface Subscriber extends Document {
  email: string;
  status: number;
}
