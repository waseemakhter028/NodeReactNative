import { Request } from 'express';
import _ from 'lodash';
import moment from 'moment';
import striptags from 'striptags';
import AddressModel from '../models/address';
import CartModel from '../models/cart';
import UserCouponModel from '../models/userCoupon';
import CouponModel from '../models/coupon';
import OrderModel from '../models/order';
import OrderCouponModel from '../models/orderCoupon';
import ProductModel from '../models/product';
import ProductOrderModel from '../models/productOrder';
import TransactionModel from '../models/transaction';
import { ObjectId, getTimezone, rand } from '../utils/common';
import { Order } from 'interfaces/models';
import { InsertCouponLog, InsertTransaction, InsertOrder } from '../interfaces/common';

class OrderService {
  static async checkCoupon(req: Request): Promise<Response | string | number> {
    try {
      const { user_id, coupon_code } = req.body;

      const couponInfo = await CouponModel.findOne({ code: coupon_code }, { _id: 1, validity: 1, status: 1, code: 1 });

      if (!couponInfo) return 'Invalid Coupon';

      const userCouponInfo = await UserCouponModel.findOne({
        user_id: ObjectId(_.toString(user_id)),
        coupon_id: ObjectId(_.toString(couponInfo._id)),
      });

      if (couponInfo.status != 1) {
        return 'coupon deactivated by admin';
      } else if (!userCouponInfo) {
        return 'Invalid Coupon';
      } else if (couponInfo.validity != '' && couponInfo.validity != null) {
        const timezone = getTimezone(req);
        const curDate = moment.utc().tz(timezone).format('YYYY-MM-DD');
        const couponDate = moment.utc(couponInfo.validity).tz(timezone).format('YYYY-MM-DD');
        if (couponDate < curDate) return 'Coupon Expired';
      }

      return 1;
    } catch (err: any) {
      throw Error(err);
    }
  }

  static async insertCouponLog(data: InsertCouponLog): Promise<Response | void> {
    try {
      const { user_id, id, order_id } = data;

      await UserCouponModel.findByIdAndUpdate(
        id,
        {
          used: 1,
        },
        { new: true },
      );

      await OrderCouponModel.create({
        user_id: user_id,
        user_coupon_id: id,
        order_id: order_id,
      });
    } catch (err: any) {
      throw Error(err);
    }
  }

  static async insertTransaction(data: InsertTransaction): Promise<string> {
    try {
      const { user_id, total_amount, payment_method, status } = data;

      const save = await TransactionModel.create({
        user_id: user_id,
        total_amount: total_amount,
        payment_method: payment_method,
        status: status,
      });

      return save.id;
    } catch (err: any) {
      throw Error(err);
    }
  }

  static async insertOrder(data: InsertOrder): Promise<Order> {
    try {
      const { user_id, transaction_id, transaction_detail, notes, address_id, delivery_charge } = data;

      const addressInfo = await AddressModel.findById(address_id);

      const orderInfo = await OrderModel.create({
        order_id: 'EY' + rand(12345678, 99999999),
        user_id: user_id,
        transaction_id: transaction_id,
        transaction_detail: transaction_detail,
        address_detail: addressInfo,
        notes: striptags(notes),
        delivery_charge: delivery_charge,
        status: 1,
      });

      const cart = await CartModel.find(
        { user_id: ObjectId(user_id) },
        { id: 1, user_id: 1, quantity: 1, size: 1, color: 1 },
      )
        .populate({ path: 'product_id', select: '_id qty name price status' })
        .sort({ createdAt: -1 });

      if (cart.length > 0) {
        for (const row of cart) {
          const qty = +row.quantity;
          await ProductOrderModel.create({
            order_id: orderInfo._id,
            product_id: row.product_id?._id,
            price: row.product_id.price,
            quantity: qty,
            size: row.size,
            color: row.color,
          });

          await ProductModel.findByIdAndUpdate(row.product_id._id, {
            $inc: { qty: -qty },
          });
        } //for loop close

        await CartModel.deleteMany({ user_id: ObjectId(user_id) });
      }
      return orderInfo;
    } catch (err: any) {
      throw Error(err);
    }
  }
}

export default OrderService;
