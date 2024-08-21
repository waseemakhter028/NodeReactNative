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
const user_1 = __importDefault(require("../models/user"));
const notification_1 = __importDefault(require("../models/notification"));
class NotificationService {
    static create(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, title = 'title', body = 'body') {
            try {
                const userInfo = yield user_1.default.findById(userId);
                if (userInfo) {
                    yield notification_1.default.create({
                        user_id: userId,
                        title: title,
                        body: body,
                    });
                }
            }
            catch (err) {
                throw Error(err);
            }
        });
    }
}
exports.default = NotificationService;
