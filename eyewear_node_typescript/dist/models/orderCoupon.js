"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderCouponSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    user_coupon_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User_Coupon',
    },
    order_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
    },
}, { timestamps: true, strict: true });
exports.default = (0, mongoose_1.model)('Order_Coupon', orderCouponSchema);
