"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const auth_1 = require("../middleware/auth");
const user_1 = __importDefault(require("../models/user"));
const userCoupon_1 = __importDefault(require("../models/userCoupon"));
const common_1 = require("../utils/common");
class CouponController {
    constructor() {
        this.path = '/coupons';
        this.router = (0, express_1.Router)();
        this.userCouponModel = userCoupon_1.default;
        this.userModel = user_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, common_1.getAuthorization)(req);
                const user = yield this.userModel.findOne({ api_token: token });
                const data = [];
                const coupons = yield this.userCouponModel
                    .find({ user_id: mongoose_1.default.Types.ObjectId.createFromHexString(user === null || user === void 0 ? void 0 : user.id), used: 0 })
                    .populate({
                    path: 'coupon_id',
                    select: '_id title code description validity',
                });
                const timezone = (0, common_1.getTimezone)(req);
                if (coupons.length > 0) {
                    for (const coupon of coupons) {
                        const info = coupon.coupon_id;
                        let date = 'Lifetime';
                        if ((info === null || info === void 0 ? void 0 : info.validity) != '' && info.validity != null) {
                            const curDate = moment_1.default.utc().tz(timezone).format('YYYY-MM-DD');
                            const couponDate = moment_1.default.utc(info.validity).tz(timezone).format('YYYY-MM-DD');
                            date = couponDate > curDate ? moment_1.default.utc(info.validity).tz(timezone).format('DD-MMM-YYYY') : 'Expired';
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
                return JSONResponse_1.default.success(res, data, 'Coupons Fetched Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, auth_1.authenticate, this.index);
    }
}
exports.default = CouponController;
