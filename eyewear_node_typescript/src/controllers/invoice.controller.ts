import { Router, Request, Response } from 'express';
import _ from 'lodash';
import moment from 'moment';
import Controller from '../interfaces/controller.interface';
import { authenticate } from '../middleware/auth';
import JSONResponse from '../response/JSONResponse';
import ProductOrderModel from '../models/productOrder';
import OrderCouponModel from '../models/orderCoupon';
import OrderModel from '../models/order';
import { ObjectId } from '../utils/common';

class InvoiceController implements Controller {
  public router = Router();
  private productOrderModel = ProductOrderModel;
  private orderCouponModel = OrderCouponModel;
  private orderModel = OrderModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`/orderinvoiceinfo`, authenticate, this.index);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    let { order_id } = req.query;
    order_id = _.toString(order_id);

    const timezone = req.get('timezone') ?? 'Asia/Calcutta';

    if (_.isEmpty(order_id)) return JSONResponse.error(res, 'Invalid Order', 200);

    try {
      const orderInfo = await this.orderModel.findById(order_id).populate({
        path: 'transaction_id',
        // select: "payment_method",
      });

      if (!orderInfo) return JSONResponse.error(res, 'Invalid Order', 200);

      const products = await this.productOrderModel
        .find({
          order_id: ObjectId(order_id),
        })
        .populate({ path: 'product_id', select: 'name image' });

      const CouponOrder = await this.orderCouponModel
        .findOne({
          order_id: ObjectId(order_id),
        })
        .populate({
          path: 'user_coupon_id',
          select: 'coupon_amount',
          populate: {
            path: 'coupon_id',
            select: 'title',
          },
        });

      const coupon = !CouponOrder ? null : CouponOrder;

      let payment_method = null;

      if (orderInfo.transaction_id.payment_method === 'razorpay') {
        if (orderInfo?.transaction_detail?.method === 'card') {
          payment_method = 'Card***** ' + orderInfo?.transaction_detail?.card?.last4;
        } else {
          payment_method = orderInfo?.transaction_detail?.method;
        }
      } else {
        payment_method = 'Coupon';
      }

      const order_time = moment.utc(orderInfo.createdAt).tz(timezone);

      const orderTime = moment(order_time).format('DD-MMM-YYYY h:mm A');

      const data = {
        products: products,
        payment_method: payment_method,
        orderInfo: orderInfo,
        order_time: orderTime,
        coupon: coupon,
      };
      return JSONResponse.success(res, data, 'Data Retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default InvoiceController;
