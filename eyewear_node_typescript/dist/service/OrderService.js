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
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const striptags_1 = __importDefault(require("striptags"));
const address_1 = __importDefault(require("../models/address"));
const cart_1 = __importDefault(require("../models/cart"));
const userCoupon_1 = __importDefault(require("../models/userCoupon"));
const coupon_1 = __importDefault(require("../models/coupon"));
const order_1 = __importDefault(require("../models/order"));
const orderCoupon_1 = __importDefault(require("../models/orderCoupon"));
const product_1 = __importDefault(require("../models/product"));
const productOrder_1 = __importDefault(require("../models/productOrder"));
const transaction_1 = __importDefault(require("../models/transaction"));
const common_1 = require("../utils/common");
class OrderService {
    static checkCoupon(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, coupon_code } = req.body;
                const couponInfo = yield coupon_1.default.findOne({ code: coupon_code }, { _id: 1, validity: 1, status: 1, code: 1 });
                if (!couponInfo)
                    return 'Invalid Coupon';
                const userCouponInfo = yield userCoupon_1.default.findOne({
                    user_id: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)),
                    coupon_id: (0, common_1.ObjectId)(lodash_1.default.toString(couponInfo._id)),
                });
                if (couponInfo.status != 1) {
                    return 'coupon deactivated by admin';
                }
                else if (!userCouponInfo) {
                    return 'Invalid Coupon';
                }
                else if (couponInfo.validity != '' && couponInfo.validity != null) {
                    const timezone = (0, common_1.getTimezone)(req);
                    const curDate = moment_1.default.utc().tz(timezone).format('YYYY-MM-DD');
                    const couponDate = moment_1.default.utc(couponInfo.validity).tz(timezone).format('YYYY-MM-DD');
                    if (couponDate < curDate)
                        return 'Coupon Expired';
                }
                return 1;
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
    static insertCouponLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, id, order_id } = data;
                yield userCoupon_1.default.findByIdAndUpdate(id, {
                    used: 1,
                }, { new: true });
                yield orderCoupon_1.default.create({
                    user_id: user_id,
                    user_coupon_id: id,
                    order_id: order_id,
                });
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
    static insertTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, total_amount, payment_method, status } = data;
                const save = yield transaction_1.default.create({
                    user_id: user_id,
                    total_amount: total_amount,
                    payment_method: payment_method,
                    status: status,
                });
                return save.id;
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
    static insertOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { user_id, transaction_id, transaction_detail, notes, address_id, delivery_charge } = data;
                const addressInfo = yield address_1.default.findById(address_id);
                const orderInfo = yield order_1.default.create({
                    order_id: 'EY' + (0, common_1.rand)(12345678, 99999999),
                    user_id: user_id,
                    transaction_id: transaction_id,
                    transaction_detail: transaction_detail,
                    address_detail: addressInfo,
                    notes: (0, striptags_1.default)(notes),
                    delivery_charge: delivery_charge,
                    status: 1,
                });
                const cart = yield cart_1.default.find({ user_id: (0, common_1.ObjectId)(user_id) }, { id: 1, user_id: 1, quantity: 1, size: 1, color: 1 })
                    .populate({ path: 'product_id', select: '_id qty name price status' })
                    .sort({ createdAt: -1 });
                if (cart.length > 0) {
                    for (const row of cart) {
                        const qty = +row.quantity;
                        yield productOrder_1.default.create({
                            order_id: orderInfo._id,
                            product_id: (_a = row.product_id) === null || _a === void 0 ? void 0 : _a._id,
                            price: row.product_id.price,
                            quantity: qty,
                            size: row.size,
                            color: row.color,
                        });
                        yield product_1.default.findByIdAndUpdate(row.product_id._id, {
                            $inc: { qty: -qty },
                        });
                    } //for loop close
                    yield cart_1.default.deleteMany({ user_id: (0, common_1.ObjectId)(user_id) });
                }
                return orderInfo;
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
}
exports.default = OrderService;
