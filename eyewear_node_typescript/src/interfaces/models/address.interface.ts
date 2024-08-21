import Document from '../db.interface';

export default interface Address extends Document {
  user_id: string;
  address_type: string;
  street: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  landmark: string;
  country: string;
}
