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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
class App {
    constructor(controllers, port, host) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.host = host;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }
    initialiseMiddleware() {
        this.express.use((0, helmet_1.default)({
            crossOriginResourcePolicy: false,
        }));
        this.express.use((0, cors_1.default)());
        this.express.options('*', (0, cors_1.default)());
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(body_parser_1.default.json({ limit: '2mb' }));
        this.express.use(body_parser_1.default.urlencoded({ extended: true }));
        this.express.use((0, compression_1.default)({
            level: 6,
            threshold: 10 * 100,
            filter: (req, res) => {
                if (req.headers['x-no-compression']) {
                    return false;
                }
                return compression_1.default.filter(req, res);
            },
        }));
        this.express.set('views', path_1.default.join(__dirname, '../views'));
        this.express.set('view engine', 'ejs');
        this.express.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
        this.express.use((0, express_fileupload_1.default)());
    }
    initialiseControllers(controllers) {
        controllers.forEach((controller) => {
            if (controller.path != '/')
                this.express.use('/api/v1', controller.router);
            else
                this.express.use('/', controller.router);
        });
    }
    initialiseErrorHandling() {
        this.express.use(error_middleware_1.errorPageNotMiddleware);
        this.express.use(error_middleware_1.genericErrorHandler);
    }
    initialiseDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const { MONGO_URI } = process.env;
            const uri = String(MONGO_URI);
            try {
                yield mongoose_1.default.connect(uri);
                console.log('MONGODB CONNECTED SUCCESSFULLY!');
            }
            catch (error) {
                console.log('Mongo Connection Error: ' + error);
            }
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server up successfully - host: ${this.host} port: ${this.port}`);
        });
    }
}
exports.default = App;
