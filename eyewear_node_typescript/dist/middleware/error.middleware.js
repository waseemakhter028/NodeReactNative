"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericErrorHandler = exports.errorPageNotMiddleware = void 0;
const errorPageNotMiddleware = (request, response) => {
    const status = 404;
    const message = 'Page not found';
    response.status(status).json({
        status,
        message,
    });
};
exports.errorPageNotMiddleware = errorPageNotMiddleware;
const genericErrorHandler = (err, req, res) => {
    var _a;
    let error;
    console.log(err.message);
    if (err.status === undefined && ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data)) {
        ({ error } = err.response.data);
    }
    else if (err.status === 405) {
        error = {
            code: err.status,
            message: 'method not allowed',
            lineNumber: err.stack,
        };
    }
    else if (err.status < 500) {
        error = {
            code: err.status,
            message: err.message,
            lineNumber: err.stack,
        };
    }
    else {
        // Return INTERNAL_SERVER_ERROR for all other cases
        error = {
            code: 500,
            message: err.message,
            lineNumber: err.stack,
        };
    }
    if (process.env.NODE_ENV === 'production' && err.status === 500) {
        error = {
            code: error.code,
            message: 'Something is wrong',
        };
    }
    res.status(error.code).json({ error });
};
exports.genericErrorHandler = genericErrorHandler;
