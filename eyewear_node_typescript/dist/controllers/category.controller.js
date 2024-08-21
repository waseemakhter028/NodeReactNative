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
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const product_1 = __importDefault(require("../models/product"));
class CategoryController {
    constructor() {
        this.path = '/category';
        this.router = (0, express_1.Router)();
        this.productModel = product_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.productModel.aggregate([
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'category',
                            foreignField: '_id',
                            as: 'cat',
                        },
                    },
                    // use unwind to array to object conversion becasue mongodb alwayas return array
                    {
                        $unwind: '$cat',
                    },
                    {
                        $project: {
                            _id: 0,
                            categoryId: '$cat._id',
                            name: '$cat.name',
                        },
                    },
                    {
                        $group: {
                            _id: '$categoryId',
                            categoryId: { $first: '$categoryId' },
                            name: { $first: '$name' },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            id: '$categoryId',
                        },
                    },
                    {
                        $sort: { name: 1 },
                    },
                ]);
                return JSONResponse_1.default.success(res, categories, 'Category Fetched Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`${this.path}`, this.index);
    }
}
exports.default = CategoryController;
