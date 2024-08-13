"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.login = exports.register = void 0;
const userService = __importStar(require("./userService"));
const error_1 = require("../utils/constant/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerValidation_1 = __importDefault(require("../validation/registerValidation"));
const loginValidation_1 = __importDefault(require("../validation/loginValidation"));
function register(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error, value } = registerValidation_1.default.validate(body);
        if (error === null || error === void 0 ? void 0 : error.details) {
            console.log(error);
            throw new Error(error_1.ERROR_MESSAGE.WRONG_INPUT);
        }
        const existEmail = yield userService.getSingleUser({
            email: value.email,
        });
        if (existEmail) {
            throw new Error(error_1.ERROR_MESSAGE.EXISTED_DATA);
        }
        const hashedPassword = yield bcrypt_1.default.hash(value.password, 10);
        const user = yield userService.createUser(Object.assign(Object.assign({}, value), { password: hashedPassword }));
        return { id: user.id };
    });
}
exports.register = register;
function login(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error, value } = loginValidation_1.default.validate(body);
        if (error === null || error === void 0 ? void 0 : error.details) {
            console.log(error);
            throw new Error(error_1.ERROR_MESSAGE.WRONG_INPUT);
        }
        const condition = value.condition;
        const existUser = yield userService.getLoginUser(condition);
        if (!existUser) {
            throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
        }
        const isMatchPassword = yield bcrypt_1.default.compare(value.password, existUser.password);
        if (!isMatchPassword) {
            throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
        }
        const token = jsonwebtoken_1.default.sign(existUser, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        return { token };
    });
}
exports.login = login;
