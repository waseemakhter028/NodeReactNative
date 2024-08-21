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
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const product_1 = __importDefault(require("../models/product"));
const common_1 = require("../utils/common");
class HomeController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productModel = product_1.default;
        this.getHomeProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = lodash_1.default.toString(req.query.category);
                if (lodash_1.default.isEmpty(category)) {
                    const rows = yield this.productModel
                        .find({}, { id: '$_id', name: 1, price: 1, image: 1 })
                        .limit(4)
                        .sort({ createdAt: -1 });
                    return JSONResponse_1.default.success(res, rows, 'Data Retrived Successfully!');
                }
                else {
                    const rows = yield this.productModel
                        .find({ category: (0, common_1.ObjectId)(category) }, { id: '$_id', name: 1, price: 1, image: 1 })
                        .limit(4)
                        .sort({ createdAt: -1 });
                    return JSONResponse_1.default.success(res, rows, 'Data Retrived Successfully!');
                }
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.topRatedProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rows = yield this.productModel.aggregate([
                    {
                        $match: { status: 1 },
                    },
                    {
                        $lookup: {
                            from: 'product_ratings',
                            localField: '_id',
                            foreignField: 'product_id',
                            as: 'ratings',
                        },
                    },
                    { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            id: '$_id',
                            _id: 1,
                            name: 1,
                            price: 1,
                            image: 1,
                            qty: 1,
                            ratings: { $ifNull: ['$ratings.rating', 0] },
                        },
                    },
                    {
                        $group: {
                            _id: '$id',
                            avgRating: { $avg: '$ratings' },
                            total: { $sum: 1 },
                            name: { $first: '$name' },
                            price: { $first: '$price' },
                            image: { $first: '$image' },
                            qty: { $first: '$qty' },
                        },
                    },
                    { $match: { avgRating: { $gte: 0 } } },
                    { $sort: { avgRating: -1 } },
                    { $limit: 4 },
                    { $project: { id: '$_id', _id: 0, name: 1, price: 1, image: 1, qty: 1 } },
                ]);
                return JSONResponse_1.default.success(res, rows, 'Data Retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`/homeproducts`, this.getHomeProducts);
        this.router.get(`/topratedproducts`, this.topRatedProducts);
    }
}
exports.default = HomeController;
