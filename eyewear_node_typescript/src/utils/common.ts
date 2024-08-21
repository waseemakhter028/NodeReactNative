import path from 'path';
import mongoose from 'mongoose';
import { Request } from 'express';
import moment from 'moment-timezone';
import { Pagination } from '../interfaces/common';
import { TIMEZONE } from '../constant/common';

export function getRootPath(): string {
  return path.resolve(__dirname, '../../');
}

export function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function toTimeZone(time: string, zone = 'Asia/Kolkata'): string {
  const format = 'YYYY-MM-DD HH:mm:ss';
  return moment(time, format).tz(zone).format(format);
}

export function paginate(page: number | string, page_size = 6): Pagination {
  page = page ? +page : 0;
  if (page >= 1) {
    page = page - 1;
  }

  const offset = page * page_size;
  const limit = page_size;

  return { offset, limit };
}

export function deliveryFee(amt: number) {
  amt = +amt;
  let fee = 0;
  if (amt > 0 && amt <= 1000) fee = (amt * 10) / 100;
  else if (amt > 1000 && amt <= 2000) fee = (amt * 5) / 100;
  else if (amt > 2000 && amt <= 6000) fee = (amt * 3) / 100;
  else if (amt > 6000 && amt <= 10000) fee = (amt * 2) / 100;
  return Math.ceil(fee).toFixed(2);
}

export function orderStatus(key: number): string {
  const order_status = ['placed', 'confirmed', 'shiped', 'delivered'];

  return !order_status[key - 1] ? '' : order_status[key - 1];
}

export function getTimezone(req: Request): string {
  return req.get('timezone') ?? TIMEZONE;
}

export function getAuthorization(req: Request): string {
  return req.get('Authorization') ?? req.get('authorization') ?? '';
}

export function ObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}
