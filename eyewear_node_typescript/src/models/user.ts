import { Schema, model } from 'mongoose';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import { PASSWORD } from '../constant/common';
import { User } from '../interfaces/models';

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
    email_verified_status: {
      type: Boolean,
      default: false,
    },
    api_token: {
      type: String,
      trim: true,
      default: null,
    },
    otp: {
      type: Number,
      integer: true,
      trim: true,
      index: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: null,
    },
    role: {
      type: Number,
      integer: true,
      default: 0, // 0=user, 1=admin
    },
    device_token: {
      type: String,
      default: null,
    },
    social_id: {
      type: String, //incase of social login
      default: null,
    },
    login_type: {
      type: Number, // 0=normal, 1=google, 2=facebook
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: 0,
    },
    image: {
      type: String, //incase of social login
      default: null,
    },
    status: {
      type: Number,
      integer: true,
      get: (v: number) => Math.round(v),
      set: (v: number) => Math.round(v),
      default: 1,
    },
  },
  { timestamps: true, strict: true },
);

userSchema.virtual('addresses', {
  ref: 'Address',
  localField: '_id',
  foreignField: 'user_id',
});

userSchema.virtual('carts', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'user_id',
});

userSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'user_id',
});

userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user_id',
});

userSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = _.upperFirst(_.toLower(this.name));
  }

  // saving hash password to db
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(PASSWORD.SALT_LENGTH);
    this.password = bcrypt.hashSync(this.password.trim(), salt);
  }

  next();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
  },
});

export default model<User>('User', userSchema);
