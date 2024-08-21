"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIMEZONE = exports.PASSWORD = exports.settings = exports.fullname_regex = exports.numbers_validation_regex = exports.email_validation_regex = exports.ph_code = exports.DEFAULT_DISTANCE = exports.ADMIN = void 0;
const ADMIN = {
    email: '',
    otpSubject: 'Eyewear OTP',
};
exports.ADMIN = ADMIN;
const DEFAULT_DISTANCE = 20;
exports.DEFAULT_DISTANCE = DEFAULT_DISTANCE;
const ph_code = '+1';
exports.ph_code = ph_code;
const TIMEZONE = 'Asia/Kolkata';
exports.TIMEZONE = TIMEZONE;
const email_validation_regex = 
// eslint-disable-next-line no-useless-escape
/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
exports.email_validation_regex = email_validation_regex;
const numbers_validation_regex = /^[0-9]+$/;
exports.numbers_validation_regex = numbers_validation_regex;
const fullname_regex = /^[a-z]+/g;
exports.fullname_regex = fullname_regex;
const settings = {
    PER_PAGE_RECORDS: 6,
    PAGE_NO: 1,
    IS_EXPORT: 0,
    ORDER_BY: 'id-DESC',
    RETURN_DB_DATE_TIME_FORMAT: '%b %d, %Y %l:%i %p',
    RETURN_DB_DATE_FORMAT: '%D %M, %Y',
    FULL_DATE_FORMAT: '%D %M %Y',
    DEFAULT_VALUE: 'N/A',
    expiresIn: '28d',
};
exports.settings = settings;
const PASSWORD = {
    MIN: 8,
    MAX: 50,
    SALT_LENGTH: 10,
};
exports.PASSWORD = PASSWORD;
