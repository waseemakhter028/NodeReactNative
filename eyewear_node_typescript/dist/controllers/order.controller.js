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
const razorpay_1 = __importDefault(require("razorpay"));
const cart_1 = __importDefault(require("../models/cart"));
const address_1 = __importDefault(require("../models/address"));
const user_1 = __importDefault(require("../models/user"));
const userCoupon_1 = __importDefault(require("../models/userCoupon"));
const coupon_1 = __importDefault(require("../models/coupon"));
const order_1 = __importDefault(require("../models/order"));
const orderCoupon_1 = __importDefault(require("../models/orderCoupon"));
const transaction_1 = __importDefault(require("../models/transaction"));
const productOrder_1 = __importDefault(require("../models/productOrder"));
const product_1 = __importDefault(require("../models/product"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const OrderService_1 = __importDefault(require("../service/OrderService"));
const NotificationService_1 = __importDefault(require("../service/NotificationService"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const order_validation_1 = __importDefault(require("../validationSchema/order.validation"));
const auth_1 = require("../middleware/auth");
const common_1 = require("../utils/common");
class OrderController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.cartModel = cart_1.default;
        this.addressModel = address_1.default;
        this.userModel = user_1.default;
        this.userCouponModel = userCoupon_1.default;
        this.couponModel = coupon_1.default;
        this.orderModel = order_1.default;
        this.orderCouponModel = orderCoupon_1.default;
        this.transactionModel = transaction_1.default;
        this.productOrderModel = productOrder_1.default;
        this.productModel = product_1.default;
        this.getDeliveryCharge = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { total_amount } = req.body;
                const delivery_charge = (0, common_1.deliveryFee)(total_amount);
                return JSONResponse_1.default.success(res, delivery_charge, 'Data retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.getCheckoutInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.query;
                const user = yield this.userModel.findById(user_id);
                if (!user) {
                    return JSONResponse_1.default.error(res, 'User not found', 200);
                }
                const data = {
                    coupon: [],
                    cart: [],
                    address: [],
                    delivery_charge: 0,
                };
                data['cart'] = yield this.cartModel.aggregate([
                    {
                        $match: { user_id: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)) },
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
                    sumSubTotal = data['cart'].reduce(function (accumulator, item) {
                        return accumulator + item.quantity * item.price;
                    }, 0);
                }
                data['delivery_charge'] = parseInt((0, common_1.deliveryFee)(sumSubTotal));
                data['address'] = yield this.addressModel
                    .find({
                    user_id: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)),
                })
                    .sort({ createdAt: -1 });
                const coupons = yield this.userCouponModel
                    .find({
                    user_id: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)),
                    used: 0,
                })
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
                        data['coupon'].push({
                            title: info.title,
                            code: info.code,
                            description: info.description,
                            amount: coupon.coupon_amount,
                            validity: date,
                        });
                    }
                }
                return JSONResponse_1.default.success(res, data, 'Data retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.checkOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.body;
                const user = yield this.userModel.findById(user_id);
                if (!user) {
                    return JSONResponse_1.default.error(res, 'User not found', 200);
                }
                const cart = yield this.cartModel
                    .find({ user_id: (0, common_1.ObjectId)(user.id) }, { id: 1, user_id: 1, quantity: 1 })
                    .populate({ path: 'product_id', select: '_id qty name price status' })
                    .sort({ createdAt: -1 });
                if (cart.length < 1)
                    return JSONResponse_1.default.error(res, 'Cart is empty', 200);
                for (const row of cart) {
                    const product = row.product_id;
                    if (product.status !== 1)
                        return JSONResponse_1.default.error(res, `${product.name} product is deactivated by admin`, 200);
                    else if (row.quantity > 20)
                        return JSONResponse_1.default.error(res, `${product.name} for this product only you can order 20 quantity at a time`, 200);
                    else if (product.qty === 0)
                        return JSONResponse_1.default.error(res, `${product.name} product is out of stock`, 200);
                    else if (row.quantity > product.qty)
                        return JSONResponse_1.default.error(res, `${product.name} for this product quantity is allowed only ${product.qty}`, 200);
                }
                return JSONResponse_1.default.success(res, {}, 'You can checkout!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.applyCoupon = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const check = yield OrderService_1.default.checkCoupon(req);
            if (check == 1)
                return JSONResponse_1.default.success(res, {}, 'Coupon applied successfully!');
            else
                return JSONResponse_1.default.error(res, lodash_1.default.toString(check), 200);
        });
        this.couponCheckout = (req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userCart = yield this.cartModel
                    .find({ user_id: (0, common_1.ObjectId)(req.body.user_id) }, { id: 1, user_id: 1, quantity: 1 })
                    .populate({ path: 'product_id', select: '_id qty name price status' })
                    .sort({ createdAt: -1 });
                let subTotal = 0;
                userCart.map((row) => (subTotal += +row.product_id.price * +row.quantity));
                const deliveryCharge = parseFloat((0, common_1.deliveryFee)(subTotal));
                let total = subTotal + deliveryCharge;
                total = +total.toFixed(2);
                let userCouponInfo = null;
                let couponInfo = null;
                if (!lodash_1.default.isEmpty(req.body.coupon_code)) {
                    const check = yield OrderService_1.default.checkCoupon(req);
                    if (check == 1) {
                        couponInfo = yield this.couponModel.findOne({ code: req.body.coupon_code }, { _id: 1, validity: 1, status: 1, code: 1 });
                        userCouponInfo = yield this.userCouponModel.findOne({
                            user_id: (0, common_1.ObjectId)(req.body.user_id),
                            coupon_id: (0, common_1.ObjectId)(couponInfo === null || couponInfo === void 0 ? void 0 : couponInfo.id),
                        });
                    }
                    else {
                        throw Error(lodash_1.default.toString(check));
                    }
                }
                const transactionData = {
                    user_id: req.body.user_id,
                    total_amount: +total,
                    payment_method: req.body.payment_method,
                    status: 'paid',
                };
                const transaction_id = yield OrderService_1.default.insertTransaction(transactionData);
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
                const order = yield OrderService_1.default.insertOrder(orderData);
                const couponData = {
                    user_id: req.body.user_id,
                    id: userCouponInfo === null || userCouponInfo === void 0 ? void 0 : userCouponInfo.id,
                    order_id: order.id,
                };
                yield OrderService_1.default.insertCouponLog(couponData);
                return order;
            }
            catch (e) {
                throw Error(e);
            }
        });
        this.razorpayCheckout = (req) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userCart = yield this.cartModel
                    .find({ user_id: (0, common_1.ObjectId)(req.body.user_id) }, { id: 1, user_id: 1, quantity: 1 })
                    .populate({ path: 'product_id', select: '_id qty name price status' })
                    .sort({ createdAt: -1 });
                let subTotal = 0;
                userCart.map((row) => (subTotal += +row.product_id.price * +row.quantity));
                const deliveryCharge = parseFloat((0, common_1.deliveryFee)(subTotal));
                let total = subTotal + deliveryCharge;
                total = +total.toFixed(2);
                let userCouponInfo = null;
                let couponInfo = null;
                if (!lodash_1.default.isEmpty(req.body.coupon_code)) {
                    const check = yield OrderService_1.default.checkCoupon(req);
                    if (check == 1) {
                        couponInfo = yield this.couponModel.findOne({ code: req.body.coupon_code }, { _id: 1, validity: 1, status: 1, code: 1 });
                        userCouponInfo = yield this.userCouponModel.findOne({
                            user_id: (0, common_1.ObjectId)(req.body.user_id),
                            coupon_id: (0, common_1.ObjectId)(couponInfo === null || couponInfo === void 0 ? void 0 : couponInfo.id),
                        });
                    }
                    else {
                        throw Error(lodash_1.default.toString(check));
                    }
                }
                if (total < 50) {
                    throw Error('minimum order value is 50');
                }
                const razorpay = new razorpay_1.default({
                    key_id: (_a = process.env['RAZORPAY_API_KEY_ID']) !== null && _a !== void 0 ? _a : '', // Replace with your key ID
                    key_secret: process.env['RAZORPAY_API_KEY_SECRET'], // Replace with your key secret
                });
                const charge = yield razorpay.payments.fetch(req.body.paymentId);
                let order;
                if (charge.status) {
                    if (charge.status !== 'captured') {
                        yield razorpay.payments.capture(charge.id, charge.amount, 'inr');
                    }
                    const transactionData = {
                        user_id: req.body.user_id,
                        total_amount: total,
                        payment_method: req.body.payment_method,
                        status: 'paid',
                    };
                    const transaction_id = yield OrderService_1.default.insertTransaction(transactionData);
                    const orderData = {
                        user_id: req.body.user_id,
                        transaction_id: transaction_id,
                        transaction_detail: charge,
                        payment_method: req.body.payment_method,
                        notes: req.body.notes,
                        address_id: req.body.address_id,
                        delivery_charge: deliveryCharge,
                    };
                    order = yield OrderService_1.default.insertOrder(orderData);
                    if (!lodash_1.default.isEmpty(req.body.coupon_code)) {
                        const couponData = {
                            user_id: req.body.user_id,
                            id: userCouponInfo === null || userCouponInfo === void 0 ? void 0 : userCouponInfo.id,
                            order_id: order.id,
                        };
                        yield OrderService_1.default.insertCouponLog(couponData);
                    }
                    return order;
                }
            }
            catch (e) {
                throw Error(e);
            }
        });
        this.placeOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { user_id } = req.body;
            try {
                const cart = yield this.cartModel
                    .find({ user_id: (0, common_1.ObjectId)(user_id) }, { id: 1, user_id: 1, quantity: 1 })
                    .populate({ path: 'product_id', select: '_id qty name price status' })
                    .sort({ createdAt: -1 });
                if (cart.length < 1)
                    return JSONResponse_1.default.error(res, 'No items in cart', 200);
                for (const row of cart) {
                    if (row.product_id.status !== 1)
                        return JSONResponse_1.default.error(res, 'Product deactivated by admin', 200);
                    else if (row.quantity > 20)
                        return JSONResponse_1.default.error(res, `${row.product_id.name} for this product only you can order 20 quantity at a time`, 200);
                    else if (row.product_id.qty === 0)
                        return JSONResponse_1.default.error(res, `${row.product_id.name} product out stock`, 200);
                    else if (row.quantity > row.product_id.qty)
                        return JSONResponse_1.default.error(res, `${row.product_id.name} available quantity of product ${row.product_id.qty}`, 200);
                }
                let order;
                if (req.body.payment_method === 'razorpay')
                    order = yield this.razorpayCheckout(req);
                else if (req.body.payment_method === 'coupon')
                    order = yield this.couponCheckout(req);
                const status = (0, common_1.orderStatus)((_a = order === null || order === void 0 ? void 0 : order.status) !== null && _a !== void 0 ? _a : 1);
                NotificationService_1.default.create(user_id, 'Order Placed', `Your order ${(_b = order === null || order === void 0 ? void 0 : order.order_id) !== null && _b !== void 0 ? _b : ''} is now ${status}`);
                return JSONResponse_1.default.success(res, {}, 'Order Placed Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.orders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, user_id, status } = req.query;
                const { offset, limit } = (0, common_1.paginate)(lodash_1.default.toString(page), 3);
                const match = status && +status === 4
                    ? // when order status=delivered
                        {
                            status: { $eq: 4 },
                            user_id: { $eq: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)) },
                        }
                    : // when order status!=delivered
                        {
                            status: { $ne: 4 },
                            user_id: { $eq: (0, common_1.ObjectId)(lodash_1.default.toString(user_id)) },
                        };
                const rows = yield this.orderModel.aggregate([
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
                    if (!lodash_1.default.isEmpty(rows[0].data))
                        total = rows[0].data[0].total;
                }
                else {
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
                return JSONResponse_1.default.success(res, data, 'Data Retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`/deliverycharge`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.deliveryCharge), this.getDeliveryCharge);
        this.router.get(`/getcheckoutinfo`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.checkoutInfo), this.getCheckoutInfo);
        this.router.post(`/checkOrder`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.checkOrder), this.checkOrder);
        this.router.post(`/applycoupon`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.applyCoupon), this.applyCoupon);
        this.router.post(`/placeorder`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.placeOrder), this.placeOrder);
        this.router.get(`/orders`, auth_1.authenticate, (0, validation_middleware_1.default)(order_validation_1.default.orders), this.orders);
    }
}
exports.default = OrderController;
