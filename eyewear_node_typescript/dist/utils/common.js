"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPath = getRootPath;
exports.rand = rand;
exports.toTimeZone = toTimeZone;
exports.paginate = paginate;
exports.deliveryFee = deliveryFee;
exports.orderStatus = orderStatus;
exports.getTimezone = getTimezone;
exports.getAuthorization = getAuthorization;
exports.ObjectId = ObjectId;
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const common_1 = require("../constant/common");
function getRootPath() {
    const { NODE_ENV } = process.env;
    return NODE_ENV === 'development' ? path_1.default.resolve(__dirname, '../../') : path_1.default.resolve(__dirname, '../');
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function toTimeZone(time, zone = 'Asia/Kolkata') {
    const format = 'YYYY-MM-DD HH:mm:ss';
    return (0, moment_timezone_1.default)(time, format).tz(zone).format(format);
}
function paginate(page, page_size = 6) {
    page = page ? +page : 0;
    if (page >= 1) {
        page = page - 1;
    }
    const offset = page * page_size;
    const limit = page_size;
    return { offset, limit };
}
function deliveryFee(amt) {
    amt = +amt;
    let fee = 0;
    if (amt > 0 && amt <= 1000)
        fee = (amt * 10) / 100;
    else if (amt > 1000 && amt <= 2000)
        fee = (amt * 5) / 100;
    else if (amt > 2000 && amt <= 6000)
        fee = (amt * 3) / 100;
    else if (amt > 6000 && amt <= 10000)
        fee = (amt * 2) / 100;
    return Math.ceil(fee).toFixed(2);
}
function orderStatus(key) {
    const order_status = ['placed', 'confirmed', 'shiped', 'delivered'];
    return !order_status[key - 1] ? '' : order_status[key - 1];
}
function getTimezone(req) {
    var _a;
    return (_a = req.get('timezone')) !== null && _a !== void 0 ? _a : common_1.TIMEZONE;
}
function getAuthorization(req) {
    var _a, _b;
    return (_b = (_a = req.get('Authorization')) !== null && _a !== void 0 ? _a : req.get('authorization')) !== null && _b !== void 0 ? _b : '';
}
function ObjectId(id) {
    return new mongoose_1.default.Types.ObjectId(id);
}
