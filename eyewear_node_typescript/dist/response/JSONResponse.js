"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONResponse {
    static success(res, data, message, success = true, status = 200) {
        const errorCode = 200;
        res.status(errorCode || 200).json({
            statusCode: status,
            success: success,
            message: message,
            data: data,
        });
    }
    static error(res, message, status = 200) {
        res.status(status).json({
            statusCode: status,
            success: false,
            message: message,
        });
    }
    static exception(res, message, status = 200) {
        const errorCode = 200;
        res.status(errorCode || 200).json({
            statusCode: status,
            success: false,
            message: 'Exception: ' + message,
        });
    }
    static serverError(req, res, message, data) {
        res.status(500).json({
            code: 500,
            message: message || 'internal server error',
            data: data,
        });
    }
}
exports.default = JSONResponse;
