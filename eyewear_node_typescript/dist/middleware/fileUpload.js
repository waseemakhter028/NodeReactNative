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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_type_1 = require("file-type");
const common_1 = require("../utils/common");
const fileUploadExpress = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filename = '', data = new ArrayBuffer(24), // default value
directory = 'users', size = 0, maxSize = 5, allowedExtensions = ['jpeg', 'png', 'gif', 'jpg'], allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], dbFileName = '', }) {
    var _b, _c;
    const fileInfo = yield (0, file_type_1.fromBuffer)(data);
    const ext = (_b = fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.ext.toLowerCase()) !== null && _b !== void 0 ? _b : '';
    const mimetype = (_c = fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.mime.toLowerCase()) !== null && _c !== void 0 ? _c : '';
    const maxFileSize = maxSize * 1024 * 1024;
    if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(ext)) {
        return {
            status: 'error',
            message: 'Please Select jpg, jpeg, png and gif only.',
        };
    }
    if (size > maxFileSize) {
        return {
            status: 'error',
            message: 'Max file size is allowed ' + maxSize + ' MB',
        };
    }
    // unlink old files
    if (dbFileName !== '') {
        const filePath = `${(0, common_1.getRootPath)()}/${directory}`;
        if (fs_1.default.existsSync(filePath + '/' + dbFileName)) {
            fs_1.default.unlink(path_1.default.join(filePath, dbFileName), (err) => {
                if (err)
                    throw err;
            });
        }
    }
    return {
        status: 'success',
        imageName: (0, common_1.rand)(1000000000, 9999999999) + '_' + filename,
    };
});
exports.default = fileUploadExpress;
