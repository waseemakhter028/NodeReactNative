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
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const cart_validation_1 = __importDefault(require("../validationSchema/cart.validation"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const user_1 = __importDefault(require("../models/user"));
const cart_1 = __importDefault(require("../models/cart"));
const product_1 = __importDefault(require("../models/product"));
const auth_1 = require("../middleware/auth");
class CartController {
    constructor() {
        this.path = '/carts';
        this.router = (0, express_1.Router)();
        this.userModel = user_1.default;
        this.cartModel = cart_1.default;
        this.productModel = product_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.query;
                const user = yield this.userModel.findById(user_id).populate({
                    path: 'carts',
                    select: 'id user_id quantity size color',
                    populate: {
                        path: 'product_id',
                        select: '_id image name price',
                        options: { sort: { created_at: -1 } },
                    },
                });
                if (!user)
                    return JSONResponse_1.default.error(res, 'User Not Found', 200);
                return JSONResponse_1.default.success(res, user.carts, 'Address Fetched Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.save = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, quantity, product_id, size, color } = req.body;
                const product = yield this.productModel.findById(product_id).select('_id qty');
                const user = yield this.userModel.findById(user_id).select('email');
                if (!user)
                    return JSONResponse_1.default.error(res, 'User Not Found', 200);
                else if (!product)
                    return JSONResponse_1.default.error(res, 'Product Not Found', 200);
                else if (product.qty < 1)
                    return JSONResponse_1.default.error(res, 'Product Out Of Stock', 200);
                const save = yield this.cartModel.create({
                    user_id: user_id,
                    quantity: quantity,
                    product_id: product_id,
                    size: size,
                    color: color,
                });
                if (!save)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                return JSONResponse_1.default.success(res, {}, 'Item add to cart Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { quantity } = req.body;
                const { id } = req.params;
                const save = yield this.cartModel.findByIdAndUpdate(id, { quantity: quantity });
                if (!save)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                return JSONResponse_1.default.success(res, {}, 'Cart Updated Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const save = yield this.cartModel.findByIdAndDelete(id);
                if (!save)
                    return JSONResponse_1.default.exception(res, 'Something is wrong', 200);
                return JSONResponse_1.default.success(res, {}, 'Cart Deleted Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, auth_1.authenticate, (0, validation_middleware_1.default)(cart_validation_1.default.getCart), this.index);
        this.router.post(`${this.path}`, auth_1.authenticate, (0, validation_middleware_1.default)(cart_validation_1.default.addCart), this.save);
        this.router.put(`${this.path}/:id`, auth_1.authenticate, (0, validation_middleware_1.default)(cart_validation_1.default.updateCart), this.update);
        this.router.delete(`${this.path}/:id`, auth_1.authenticate, (0, validation_middleware_1.default)(cart_validation_1.default.deleteCart), this.delete);
    }
}
exports.default = CartController;
