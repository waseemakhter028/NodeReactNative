import Document from '../db.interface';

export default interface Contact extends Document {
  name: string;
  email: string;
  phone: number;
  message: string;
}
