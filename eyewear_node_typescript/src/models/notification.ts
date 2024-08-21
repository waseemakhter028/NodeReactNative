import { Schema, model } from 'mongoose';
import { Notification } from '../interfaces/models';

const notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, strict: true },
);

export default model<Notification>('Notification', notificationSchema);
