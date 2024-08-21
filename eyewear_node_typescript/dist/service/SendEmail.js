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
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const common_1 = require("../utils/common");
const { renderFile } = ejs_1.default;
const SendMail = (to, subject, text, sendData, attachment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: process.env.EMAIL_HOST,
            // port: process.env.EMAIL_PORT,
            // secure: process.env.SECURE,
            // requireTls:true,
            //cc:"test@gmail.com",
            //bcc:"test@gmail.com",
            auth: {
                user: process.env.EMAIL_EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        let htmlText = null;
        try {
            sendData = !sendData ? { test: 'test' } : sendData;
            htmlText = yield renderFile((0, common_1.getRootPath)() + '/views/mail/' + text, sendData);
        }
        catch (e) {
            console.log('Template file loader error');
            return e;
        }
        const mailOptions = {
            from: process.env.EMAIL_FROM_EMAIL,
            to: to,
            subject: subject,
            text: '',
            html: htmlText,
        };
        let attachments = {};
        if (attachment) {
            attachments = {
                attachments: [
                    {
                        filename: attachment.filename,
                        path: attachment.filepath,
                        contentType: attachment.contentType,
                    },
                ],
            };
        }
        transporter.sendMail(Object.assign(Object.assign({}, mailOptions), attachments), function (error) {
            if (error) {
                console.log(error);
            }
        });
    }
    catch (e) {
        console.log('Send Email Error=' + e);
        return e;
    }
    return true;
});
exports.default = SendMail;
