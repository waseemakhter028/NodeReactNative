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
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const auth_1 = require("../middleware/auth");
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const productOrder_1 = __importDefault(require("../models/productOrder"));
const orderCoupon_1 = __importDefault(require("../models/orderCoupon"));
const order_1 = __importDefault(require("../models/order"));
const common_1 = require("../utils/common");
class InvoiceController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productOrderModel = productOrder_1.default;
        this.orderCouponModel = orderCoupon_1.default;
        this.orderModel = order_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            let { order_id } = req.query;
            order_id = lodash_1.default.toString(order_id);
            const timezone = (_a = req.get('timezone')) !== null && _a !== void 0 ? _a : 'Asia/Calcutta';
            if (lodash_1.default.isEmpty(order_id))
                return JSONResponse_1.default.error(res, 'Invalid Order', 200);
            try {
                const orderInfo = yield this.orderModel.findById(order_id).populate({
                    path: 'transaction_id',
                    // select: "payment_method",
                });
                if (!orderInfo)
                    return JSONResponse_1.default.error(res, 'Invalid Order', 200);
                const products = yield this.productOrderModel
                    .find({
                    order_id: (0, common_1.ObjectId)(order_id),
                })
                    .populate({ path: 'product_id', select: 'name image' });
                const CouponOrder = yield this.orderCouponModel
                    .findOne({
                    order_id: (0, common_1.ObjectId)(order_id),
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
                    if (((_b = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.transaction_detail) === null || _b === void 0 ? void 0 : _b.method) === 'card') {
                        payment_method = 'Card***** ' + ((_d = (_c = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.transaction_detail) === null || _c === void 0 ? void 0 : _c.card) === null || _d === void 0 ? void 0 : _d.last4);
                    }
                    else {
                        payment_method = (_e = orderInfo === null || orderInfo === void 0 ? void 0 : orderInfo.transaction_detail) === null || _e === void 0 ? void 0 : _e.method;
                    }
                }
                else {
                    payment_method = 'Coupon';
                }
                const order_time = moment_1.default.utc(orderInfo.createdAt).tz(timezone);
                const orderTime = (0, moment_1.default)(order_time).format('DD-MMM-YYYY h:mm A');
                const data = {
                    products: products,
                    payment_method: payment_method,
                    orderInfo: orderInfo,
                    order_time: orderTime,
                    coupon: coupon,
                };
                return JSONResponse_1.default.success(res, data, 'Data Retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`/orderinvoiceinfo`, auth_1.authenticate, this.index);
    }
}
exports.default = InvoiceController;
