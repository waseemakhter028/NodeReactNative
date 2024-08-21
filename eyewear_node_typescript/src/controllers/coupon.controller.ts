import { Router, Request, Response } from 'express';
import moment from 'moment';
import mongoose from 'mongoose';
import Controller from '../interfaces/controller.interface';
import JSONResponse from '../response/JSONResponse';
import { authenticate } from '../middleware/auth';
import UserModel from '../models/user';
import UserCouponModel from '../models/userCoupon';
import { Coupon } from '../interfaces/models/index';
import { CouponData } from '../interfaces/common';
import { getTimezone, getAuthorization } from '../utils/common';

class CouponController implements Controller {
  public path = '/coupons';
  public router = Router();
  private userCouponModel = UserCouponModel;
  private userModel = UserModel;

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticate, this.index);
  }

  private index = async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const token = getAuthorization(req);
      const user = await this.userModel.findOne({ api_token: token });

      const data: CouponData[] = [];
      const coupons = await this.userCouponModel
        .find({ user_id: mongoose.Types.ObjectId.createFromHexString(user?.id), used: 0 })
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

          data.push({
            title: info.title,
            code: info.code,
            description: info.description,
            amount: coupon.coupon_amount,
            validity: date,
          });
        }
      }

      return JSONResponse.success(res, data, 'Coupons Fetched Successfully!');
    } catch (e: any) {
      return JSONResponse.exception(res, e.message, e.code);
    }
  };
}

export default CouponController;
