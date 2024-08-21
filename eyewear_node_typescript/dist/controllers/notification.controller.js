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
const auth_1 = require("../middleware/auth");
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const common_1 = require("../utils/common");
class NotificationController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.notificationModel = notification_1.default;
        this.userModel = user_1.default;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = (0, common_1.getAuthorization)(req);
            const { page = 1 } = req.query;
            try {
                const user = yield this.userModel.findOne({ api_token: token });
                const { offset, limit } = (0, common_1.paginate)(lodash_1.default.toString(page), 3);
                const rows = yield this.notificationModel.aggregate([
                    {
                        $match: { user_id: { $eq: (0, common_1.ObjectId)(lodash_1.default.toString(user === null || user === void 0 ? void 0 : user.id)) } },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            user_id: 1,
                            title: 1,
                            body: 1,
                            read_at: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            __v: 1,
                        },
                    },
                    {
                        $facet: {
                            data: [{ $count: 'total' }],
                            metaData: [{ $skip: offset }, { $limit: limit }],
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
                const currentPage = +page || 1;
                const lastPage = Math.ceil(total / 3);
                yield this.notificationModel.updateMany({ user_id: (0, common_1.ObjectId)(user === null || user === void 0 ? void 0 : user.id) }, { read_at: Date.now() });
                const data = {
                    data: rows[0].metaData,
                    itemCount: total,
                    limit: limit,
                    last_page: lastPage,
                    currentPage: currentPage,
                    slNo: currentPage,
                    hasPrevPage: currentPage > 1,
                    hasNextPage: currentPage < lastPage,
                    prev: currentPage > 1 ? currentPage - 1 : 1,
                    next: currentPage < lastPage ? currentPage + 1 : lastPage,
                };
                return JSONResponse_1.default.success(res, data, 'Data Retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.unreadCount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = (0, common_1.getAuthorization)(req);
            try {
                const user = yield this.userModel.findOne({ api_token: token });
                let unread = yield this.notificationModel.aggregate([
                    {
                        $match: { user_id: (0, common_1.ObjectId)(user === null || user === void 0 ? void 0 : user.id), read_at: null },
                    },
                    { $count: 'count' },
                ]);
                unread = !lodash_1.default.isEmpty(unread) ? unread[0].count : 0;
                return JSONResponse_1.default.success(res, unread, 'Data Retrived Successfully!');
            }
            catch (e) {
                return JSONResponse_1.default.exception(res, e.message, e.code);
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.get(`/notifications`, auth_1.authenticate, this.index);
        this.router.get(`/unreadcount`, auth_1.authenticate, this.unreadCount);
    }
}
exports.default = NotificationController;
