import { Router, Request, Response } from 'express';
import _ from 'lodash';
import moment from 'moment';
import Razorpay from 'razorpay';
import CartModel from '../models/cart';
import AddressModel from '../models/address';
import UserModel from '../models/user';
import UserCouponModel from '../models/userCoupon';
import CouponModel from '../models/coupon';
import OrderModel from '../models/order';
import OrderCouponModel from '../models/orderCoupon';
import TransactionModel from '../models/transaction';
import ProductOrderModel from '../models/productOrder';
import ProductModel from '../models/product';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import OrderService from '../service/OrderService';
import NotificationService from '../service/NotificationService';
import validationMiddleware from '../middleware/validation.middleware';
import validate from '../validationSchema/order.validation';
import { authenticate } from '../middleware/auth';
import { deliveryFee, orderStatus, paginate, getTimezone, ObjectId } from '../utils/common';
import { Coupon, Product, Order } from '../interfaces/models';
import { Subtotal, CheckoutInfo } from 'interfaces/common';

class OrderController implements Controller {
  public router = Router();
  private cartModel = CartModel;
  private addressModel = AddressModel;
  private userModel = UserModel;
  private userCouponModel = UserCouponModel;
  private couponModel = CouponModel;
  private orderModel = OrderModel;
  private orderCouponModel = OrderCouponModel;
  private transactionModel = TransactionModel;
  private productOrderModel = ProductOrderModel;
  private productModel = ProductModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `/deliverycharge`,
      authenticate,
      validationMiddleware(validate.deliveryCharge),
      this.getDeliveryCharge,
    );

    this.router.get(
      `/getcheckoutinfo`,
      authenticate,
      validationMiddleware(validate.checkoutInfo),
      this.getCheckoutInfo,
    );

    this.router.post(`/checkOrder`, authenticate, validationMiddleware(validate.checkOrder), this.checkOrder);

    this.router.post(`/applycoupon`, authenticate, validationMiddleware(validate.applyCoupon), this.applyCoupon);

    this.router.post(`/placeorder`, authenticate, validationMiddleware(validate.placeOrder), this.placeOrder);

    this.router.get(`/orders`, authenticate, validationMiddleware(validate.orders), this.orders);
  }

  private getDeliveryCharge = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { total_amount } = req.body;
      const delivery_charge = deliveryFee(total_amount);

      return JSONResponse.success(res, delivery_charge, 'Data retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private getCheckoutInfo = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id } = req.query;
      const user = await this.userModel.findById(user_id);

      if (!user) {
        return JSONResponse.error(res, 'User not found', 200);
      }

      const data: CheckoutInfo = {
        coupon: [],
        cart: [],
        address: [],
        delivery_charge: 0,
      };

      data['cart'] = await this.cartModel.aggregate([
        {
          $match: { user_id: ObjectId(_.toString(user_id)) },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            image: '$product.image',
            name: '$product.name',
            price: '$product.price',
            user_id: 1,
            product_id: 1,
            quantity: 1,
          },
        },
      ]);

      let sumSubTotal = 0;
      if (data['cart'].length > 0) {
        sumSubTotal = data['cart'].reduce(function (accumulator: number, item: Subtotal) {
          return accumulator + item.quantity * item.price;
        }, 0);
      }
      data['delivery_charge'] = parseInt(deliveryFee(sumSubTotal));

      data['address'] = await this.addressModel
        .find({
          user_id: ObjectId(_.toString(user_id)),
        })
        .sort({ createdAt: -1 });

      const coupons = await this.userCouponModel
        .find({
          user_id: ObjectId(_.toString(user_id)),
          used: 0,
        })
        .populate({
          path: 'coupon_id',
          select: '_id title code description validity',
        });

      const timezone = getTimezone(req);

      if (coupons.length > 0) {
        for (const coupon of coupons) {
          const info: Coupon = coupon.coupon_id;
          let date = 'Lifetime';
          if (info?.validity != '' && info.validity != null) {
            const curDate = moment.utc().tz(timezone).format('YYYY-MM-DD');
            const couponDate = moment.utc(info.validity).tz(timezone).format('YYYY-MM-DD');
            date = couponDate > curDate ? moment.utc(info.validity).tz(timezone).format('DD-MMM-YYYY') : 'Expired';
          }

          data['coupon'].push({
            title: info.title,
            code: info.code,
            description: info.description,
            amount: coupon.coupon_amount,
            validity: date,
          });
        }
      }

      return JSONResponse.success(res, data, 'Data retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private checkOrder = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { user_id } = req.body;
      const user = await this.userModel.findById(user_id);

      if (!user) {
        return JSONResponse.error(res, 'User not found', 200);
      }

      const cart = await this.cartModel
        .find({ user_id: ObjectId(user.id) }, { id: 1, user_id: 1, quantity: 1 })
        .populate({ path: 'product_id', select: '_id qty name price status' })
        .sort({ createdAt: -1 });

      if (cart.length < 1) return JSONResponse.error(res, 'Cart is empty', 200);

      for (const row of cart) {
        const product: Product = row.product_id;
        if (product.status !== 1)
          return JSONResponse.error(res, `${product.name} product is deactivated by admin`, 200);
        else if (row.quantity > 20)
          return JSONResponse.error(
            res,
            `${product.name} for this product only you can order 20 quantity at a time`,
            200,
          );
        else if (product.qty === 0) return JSONResponse.error(res, `${product.name} product is out of stock`, 200);
        else if (row.quantity > product.qty)
          return JSONResponse.error(
            res,
            `${product.name} for this product quantity is allowed only ${product.qty}`,
            200,
          );
      }

      return JSONResponse.success(res, {}, 'You can checkout!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private applyCoupon = async (req: Request, res: Response): Promise<Response | void> => {
    const check = await OrderService.checkCoupon(req);

    if (check == 1) return JSONResponse.success(res, {}, 'Coupon applied successfully!');
    else return JSONResponse.error(res, _.toString(check), 200);
  };

  private couponCheckout = async (req: Request): Promise<Order | undefined> => {
    try {
      const userCart = await this.cartModel
        .find({ user_id: ObjectId(req.body.user_id) }, { id: 1, user_id: 1, quantity: 1 })
        .populate({ path: 'product_id', select: '_id qty name price status' })
        .sort({ createdAt: -1 });

      let subTotal = 0;

      userCart.map((row) => (subTotal += +row.product_id.price * +row.quantity));
      const deliveryCharge = parseFloat(deliveryFee(subTotal));
      let total = subTotal + deliveryCharge;
      total = +total.toFixed(2);

      let userCouponInfo = null;
      let couponInfo = null;

      if (!_.isEmpty(req.body.coupon_code)) {
        const check = await OrderService.checkCoupon(req);

        if (check == 1) {
          couponInfo = await this.couponModel.findOne(
            { code: req.body.coupon_code },
            { _id: 1, validity: 1, status: 1, code: 1 },
          );

          userCouponInfo = await this.userCouponModel.findOne({
            user_id: ObjectId(req.body.user_id),
            coupon_id: ObjectId(couponInfo?.id),
          });
        } else {
          throw Error(_.toString(check));
        }
      }

      const transactionData = {
        user_id: req.body.user_id,
        total_amount: +total,
        payment_method: req.body.payment_method,
        status: 'paid',
      };

      const transaction_id = await OrderService.insertTransaction(transactionData);

      const orderData = {
        user_id: req.body.user_id,
        transaction_id: transaction_id,
        transaction_detail: {
          payment_type: 'coupon',
        },
        payment_method: req.body.payment_method,
        notes: req.body.notes,
        address_id: req.body.address_id,
        delivery_charge: deliveryCharge,
      };

      const order = await OrderService.insertOrder(orderData);

      const couponData = {
        user_id: req.body.user_id,
        id: userCouponInfo?.id,
        order_id: order.id,
      };
      await OrderService.insertCouponLog(couponData);

      return order;
    } catch (e: any) {
      throw Error(e);
    }
  };

  private razorpayCheckout = async (req: Request): Promise<Order | undefined> => {
    try {
      const userCart = await this.cartModel
        .find({ user_id: ObjectId(req.body.user_id) }, { id: 1, user_id: 1, quantity: 1 })
        .populate({ path: 'product_id', select: '_id qty name price status' })
        .sort({ createdAt: -1 });

      let subTotal = 0;

      userCart.map((row) => (subTotal += +row.product_id.price * +row.quantity));
      const deliveryCharge = parseFloat(deliveryFee(subTotal));
      let total = subTotal + deliveryCharge;
      total = +total.toFixed(2);

      let userCouponInfo = null;
      let couponInfo = null;

      if (!_.isEmpty(req.body.coupon_code)) {
        const check = await OrderService.checkCoupon(req);

        if (check == 1) {
          couponInfo = await this.couponModel.findOne(
            { code: req.body.coupon_code },
            { _id: 1, validity: 1, status: 1, code: 1 },
          );

          userCouponInfo = await this.userCouponModel.findOne({
            user_id: ObjectId(req.body.user_id),
            coupon_id: ObjectId(couponInfo?.id),
          });
        } else {
          throw Error(_.toString(check));
        }
      }

      if (total < 50) {
        throw Error('minimum order value is 50');
      }

      const razorpay = new Razorpay({
        key_id: process.env['RAZORPAY_API_KEY_ID'] ?? '', // Replace with your key ID
        key_secret: process.env['RAZORPAY_API_KEY_SECRET'], // Replace with your key secret
      });

      const charge: any = await razorpay.payments.fetch(req.body.paymentId);

      let order: Order;

      if (charge.status) {
        if (charge.status !== 'captured') {
          await razorpay.payments.capture(charge.id, charge.amount, 'inr');
        }
        const transactionData = {
          user_id: req.body.user_id,
          total_amount: total,
          payment_method: req.body.payment_method,
          status: 'paid',
        };

        const transaction_id = await OrderService.insertTransaction(transactionData);

        const orderData = {
          user_id: req.body.user_id,
          transaction_id: transaction_id,
          transaction_detail: charge,
          payment_method: req.body.payment_method,
          notes: req.body.notes,
          address_id: req.body.address_id,
          delivery_charge: deliveryCharge,
        };

        order = await OrderService.insertOrder(orderData);

        if (!_.isEmpty(req.body.coupon_code)) {
          const couponData = {
            user_id: req.body.user_id,
            id: userCouponInfo?.id,
            order_id: order.id,
          };
          await OrderService.insertCouponLog(couponData);
        }

        return order;
      }
    } catch (e: any) {
      throw Error(e);
    }
  };

  private placeOrder = async (req: Request, res: Response): Promise<Response | void> => {
    const { user_id } = req.body;

    try {
      const cart = await this.cartModel
        .find({ user_id: ObjectId(user_id) }, { id: 1, user_id: 1, quantity: 1 })
        .populate({ path: 'product_id', select: '_id qty name price status' })
        .sort({ createdAt: -1 });

      if (cart.length < 1) return JSONResponse.error(res, 'No items in cart', 200);

      for (const row of cart) {
        if (row.product_id.status !== 1) return JSONResponse.error(res, 'Product deactivated by admin', 200);
        else if (row.quantity > 20)
          return JSONResponse.error(
            res,
            `${row.product_id.name} for this product only you can order 20 quantity at a time`,
            200,
          );
        else if (row.product_id.qty === 0)
          return JSONResponse.error(res, `${row.product_id.name} product out stock`, 200);
        else if (row.quantity > row.product_id.qty)
          return JSONResponse.error(
            res,
            `${row.product_id.name} available quantity of product ${row.product_id.qty}`,
            200,
          );
      }

      let order: Order | undefined;
      if (req.body.payment_method === 'razorpay') order = await this.razorpayCheckout(req);
      else if (req.body.payment_method === 'coupon') order = await this.couponCheckout(req);

      const status = orderStatus(order?.status ?? 1);

      NotificationService.create(user_id, 'Order Placed', `Your order ${order?.order_id ?? ''} is now ${status}`);

      return JSONResponse.success(res, {}, 'Order Placed Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };

  private orders = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { page = 1, user_id, status } = req.query;
      const { offset, limit } = paginate(_.toString(page), 3);

      const match =
        status && +status === 4
          ? // when order status=delivered
            {
              status: { $eq: 4 },
              user_id: { $eq: ObjectId(_.toString(user_id)) },
            }
          : // when order status!=delivered
            {
              status: { $ne: 4 },
              user_id: { $eq: ObjectId(_.toString(user_id)) },
            };

      const rows = await this.orderModel.aggregate([
        {
          $match: match,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: 'transactions',
            localField: 'transaction_id',
            foreignField: '_id',
            as: 'transaction',
          },
        },
        { $unwind: { path: '$transaction', preserveNullAndEmptyArrays: true } },

        { $addFields: { total: '$transaction.total_amount' } },

        {
          $lookup: {
            from: 'product_orders',
            localField: '_id',
            foreignField: 'order_id',
            as: 'productOrders',
          },
        },
        { $unwind: { path: '$productOrders', preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: 'products',
            localField: 'productOrders.product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

        {
          $project: {
            id: '$_id',
            _id: 0,
            order_id: 1,
            rated: 1,
            notes: 1,
            status: 1,
            transaction_detail: 1,
            address_detail: 1,
            delivery_charge: 1,
            total: 1,
            'productOrders.price': 1,
            'productOrders.quantity': 1,
            'productOrders.size': 1,
            'productOrders.color': 1,
            'product.name': 1,
            'product.image': 1,
          },
        },

        {
          $facet: {
            data: [{ $count: 'total' }],
            metaData: [
              { $skip: offset },
              { $limit: limit },

              {
                $project: {
                  id: 1,
                  order_id: 1,
                  rated: 1,
                  notes: 1,
                  status: 1,
                  total: 1,
                  transaction_detail: 1,
                  address_detail: 1,
                  delivery_charge: 1,
                  'productOrders.price': 1,
                  'productOrders.quantity': 1,
                  'productOrders.size': 1,
                  'productOrders.color': 1,
                  'product.name': 1,
                  'product.image': 1,
                },
              },
            ],
          },
        },
      ]);

      let total;
      if (rows[0].metaData.length > 0) {
        if (!_.isEmpty(rows[0].data)) total = rows[0].data[0].total;
      } else {
        total = 0;
      }

      const data = {
        data: rows[0].metaData,
        pagedata: {
          current_page: +page || 1,
          per_page: limit,
          total: total,
          last_page: Math.ceil(total / limit),
        },
      };

      return JSONResponse.success(res, data, 'Data Retrived Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default OrderController;
