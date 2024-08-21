import Document from '../db.interface';
import { User } from './index';

export default interface Notification extends Document {
  user_id: User;
  title: string;
  body: string;
  read_at: string;
}
