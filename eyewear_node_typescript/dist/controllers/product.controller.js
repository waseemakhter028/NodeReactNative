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
const productRating_1 = __importDefault(require("../models/productRating"));
const cart_1 = __importDefault(require("../models/cart"));
const common_1 = require("../constant/common");
const common_2 = require("../utils/common");
class ProductController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.productModel = product_1.default;
        this.productRatingModel = productRating_1.default;
        this.cartModel = cart_1.default;
        this.latestProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.productModel.find({}, { id: '$_id', _id: 0, name: 1, price: 1, image: 1 }).limit(4);
                return JSONResponse_1.default.success(res, data, 'Data retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.products = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { PER_PAGE_RECORDS } = common_1.settings;
                const { page = 1 } = req.query;
                let { categories, rating } = req.body;
                const { price } = req.body;
                let sort = {};
                let match = { status: 1 };
                let metaDataAggregation = [];
                //dynamic sorting for price
                if (!lodash_1.default.isEmpty(price)) {
                    const priceOrder = lodash_1.default.lowerCase(price) == 'asc' ? 1 : -1;
                    sort = { price: priceOrder };
                }
                //dynamic sorting for price and created:-1
                sort = Object.assign(Object.assign({}, sort), { createdAt: -1 });
                if (!lodash_1.default.isEmpty(categories) && lodash_1.default.isArray(categories)) {
                    categories = lodash_1.default.map(categories, (val) => (0, common_2.ObjectId)(val));
                    const categoryFilter = { category: { $in: categories } };
                    match = Object.assign(Object.assign({}, match), categoryFilter);
                }
                const { offset, limit } = (0, common_2.paginate)(+page, PER_PAGE_RECORDS);
                if (!lodash_1.default.isEmpty(rating) && lodash_1.default.isArray(rating)) {
                    metaDataAggregation = [];
                    rating = lodash_1.default.map(rating, (val) => parseInt(val));
                    const min = lodash_1.default.min(rating);
                    const max = lodash_1.default.max(rating);
                    const ratingMatch = rating.length > 1
                        ? {
                            $and: [{ avgRating: { $gte: min } }, { avgRating: { $lte: max } }],
                        }
                        : { avgRating: { $in: rating } };
                    metaDataAggregation.push({
                        $lookup: {
                            from: 'product_ratings',
                            localField: '_id',
                            foreignField: 'product_id',
                            as: 'ratings',
                        },
                    }, { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } }, {
                        $project: {
                            id: '$_id',
                            _id: 1,
                            name: 1,
                            price: 1,
                            image: 1,
                            qty: 1,
                            ratings: { $ifNull: ['$ratings.rating', 0] },
                        },
                    }, {
                        $group: {
                            _id: '$id',
                            total: { $sum: 1 },
                            name: { $first: '$name' },
                            price: { $first: '$price' },
                            image: { $first: '$image' },
                            qty: { $first: '$qty' },
                            reviewCount: { $sum: '$ratings.rating' },
                            avgRating: { $avg: '$ratings' },
                        },
                    }, {
                        $match: ratingMatch,
                    }, { $skip: offset }, { $limit: limit }, {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            name: 1,
                            price: 1,
                            image: 1,
                            qty: 1,
                            total: 1,
                            avgRating: { $round: ['$avgRating', 1] },
                            reviewCount: 1,
                        },
                    });
                }
                else {
                    metaDataAggregation = [];
                    metaDataAggregation.push({
                        $lookup: {
                            from: 'product_ratings',
                            localField: '_id',
                            foreignField: 'product_id',
                            as: 'ratings',
                        },
                    }, { $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true } }, { $skip: offset }, { $limit: limit }, {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            name: 1,
                            price: 1,
                            image: 1,
                            qty: 1,
                            reviewCount: { $sum: '$ratings.rating' },
                            avgRating: {
                                $cond: {
                                    if: {
                                        $eq: [{ $ifNull: ['$ratings.rating', ''] }, ''],
                                    },
                                    then: 0, // If "field" is null or empty string, return 0
                                    else: { $round: [{ $avg: '$ratings.rating' }, 1] }, // Otherwise, return the value of with avg with round
                                },
                            },
                        },
                    });
                }
                const rows = yield this.productModel.aggregate([
                    {
                        $match: match,
                    },
                    {
                        $sort: sort,
                    },
                    {
                        $facet: {
                            metadata: [{ $count: 'total' }],
                            data: metaDataAggregation,
                        },
                    },
                ]);
                let total;
                if (!lodash_1.default.isEmpty(rating) && !lodash_1.default.isEmpty(rows[0].data))
                    total = rows[0].data[0].total;
                else if (!lodash_1.default.isEmpty(rating) && lodash_1.default.isEmpty(rows[0].data))
                    total = 0;
                else
                    total = rows[0].metadata[0].total;
                const data = {
                    docs: rows[0].data,
                    page: +page || 1,
                    limit: limit,
                    total: total,
                    lastPage: Math.ceil(total / limit),
                };
                return JSONResponse_1.default.success(res, data, 'Data retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.showProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { product_id, user_id } = req.query;
                const product = yield this.productModel
                    .findById(product_id)
                    .select('_id name image price qty category information');
                const data = [];
                if (!product)
                    return JSONResponse_1.default.error(res, 'Product not found', 200);
                const productRating = yield this.productRatingModel.aggregate([
                    {
                        $match: { product_id: (0, common_2.ObjectId)(lodash_1.default.toString(product._id)) },
                    },
                    {
                        $facet: {
                            reviewCount: [{ $count: 'reviewCount' }],
                            avgRating: [
                                {
                                    $group: {
                                        _id: '$product_id',
                                        avgRating: { $avg: '$rating' },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        avgRating: { $round: ['$avgRating', 1] },
                                        reviewCount: 1,
                                    },
                                },
                            ],
                            comments: [
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'user_id',
                                        foreignField: '_id',
                                        as: 'user',
                                    },
                                },
                                {
                                    $unwind: '$user',
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        name: '$user.name',
                                        image: '$user.image',
                                        comment: 1,
                                        rating: 1,
                                        created_at: '$createdAt',
                                    },
                                },
                            ],
                        },
                    },
                ]);
                const relatedProducts = yield this.productModel.aggregate([
                    {
                        $match: {
                            status: { $eq: 1 },
                            category: { $eq: (0, common_2.ObjectId)(product.category) },
                            _id: { $ne: (0, common_2.ObjectId)(product.id) },
                        },
                    },
                    {
                        $sample: { size: 4 },
                    },
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            name: 1,
                            qty: 1,
                            price: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                let isCart = false;
                const checkCart = yield this.cartModel.findOne({
                    $and: [
                        { product_id: { $eq: (0, common_2.ObjectId)(lodash_1.default.toString(product_id)) } },
                        { user_id: { $eq: (0, common_2.ObjectId)(lodash_1.default.toString(user_id)) } },
                    ],
                }, { user_id: 1 });
                isCart = !checkCart === false;
                data.push({
                    extra: {
                        top_information: product.information.substring(0, 250),
                        reviewsCount: !lodash_1.default.isEmpty(productRating[0].reviewCount) ? productRating[0].reviewCount[0].reviewCount : 0,
                        avg_rating: !lodash_1.default.isEmpty(productRating[0].avgRating) ? productRating[0].avgRating[0].avgRating : 0,
                        isCart: isCart,
                    },
                    product: product,
                    reviews: !lodash_1.default.isEmpty(productRating[0].comments) ? productRating[0].comments : [],
                    relatedProducts: relatedProducts,
                });
                return JSONResponse_1.default.success(res, data[0], 'Data retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`/latestproducts`, this.latestProducts);
        this.router.post(`/products`, this.products);
        this.router.get(`/productdetail`, this.showProduct);
    }
}
exports.default = ProductController;
