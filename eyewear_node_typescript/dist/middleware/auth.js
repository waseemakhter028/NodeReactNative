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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.authenticate = exports.auth_without_login = exports.genrateUserToken = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../constant/common");
const user_1 = __importDefault(require("../models/user"));
const JSONResponse_1 = __importDefault(require("../response/JSONResponse"));
const jwt = bluebird_1.default.promisifyAll(jsonwebtoken_1.default);
const TOKEN_SECRET = (_a = process.env['TOKEN_SECRET']) !== null && _a !== void 0 ? _a : '';
const authenticate = (req, res, next) => {
    const token = req.headers['Authorization'] || req.headers['authorization'] || '';
    if (!token) {
        return JSONResponse_1.default.error(res, 'No token provided.', 200);
    }
    jwt.verify(token.toString(), TOKEN_SECRET, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            return JSONResponse_1.default.error(res, error.message, 401);
        }
        else if (!decoded.userId || decoded.userId === '') {
            return JSONResponse_1.default.error(res, 'user not found', 401);
        }
        else {
            const result = yield user_1.default.findOne({ api_token: token });
            if (result) {
                if (result.status === 0) {
                    return JSONResponse_1.default.error(res, 'account deactivated', 200);
                }
                else {
                    return next();
                }
            }
            else {
                return JSONResponse_1.default.error(res, 'session expired', 403);
            }
        }
    }));
};
exports.authenticate = authenticate;
const auth_without_login = (req, res, next) => {
    const deviceType = req.headers['devicetype'] ? req.headers['devicetype'] : 'web';
    const deviceToken = req.headers['devicetoken'] ? req.headers['devicetoken'] : '';
    req.body.data = {
        deviceType,
        deviceToken,
    };
    return next();
};
exports.auth_without_login = auth_without_login;
const genrateUserToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const options = { expiresIn: common_1.settings.expiresIn };
    const jwtToken = jwt.sign(data, TOKEN_SECRET, options);
    return jwtToken;
});
exports.genrateUserToken = genrateUserToken;
const verifyToken = (token) => {
    try {
        jwt.verify(token, TOKEN_SECRET);
        return true; // Token is valid
    }
    catch (error) {
        return false; // Token is invalid
    }
};
exports.verifyToken = verifyToken;
