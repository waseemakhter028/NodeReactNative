"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCouponSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    coupon_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Coupon',
    },
    coupon_amount: {
        type: Number,
        default: null,
    },
    used: {
        type: Number,
        integer: true,
        default: 0, //1=used 0=not used
    },
}, { timestamps: true, strict: true });
userCouponSchema.virtual('Coupon', {
    ref: 'Coupon',
    localField: 'coupon_id',
    foreignField: '_id',
});
exports.default = (0, mongoose_1.model)('User_Coupon', userCouponSchema);
