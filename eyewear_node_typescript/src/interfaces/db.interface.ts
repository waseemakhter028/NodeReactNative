import { Document, ObjectId } from 'mongoose';

export default interface DB extends Document {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  _v?: number;
}
