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
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserAttachment = exports.getProfile = exports.findSuggest = exports.searchUser = exports.getUser = exports.editUser = exports.deleteUser = exports.createUser = void 0;
const userService = __importStar(require("../services/userService"));
const errorHandler_1 = require("../utils/errorHandler");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const dataInsertUser = yield userService.createUser(body);
        res.status(200).json(dataInsertUser);
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        const { userId } = params;
        const messageDeleteUser = yield userService.deleteUser(userId);
        res.status(200).json({ message: messageDeleteUser });
    }
    catch (error) {
        console.log(error);
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.deleteUser = deleteUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const name = req.body.name;
        const username = req.body.username;
        const bio = req.body.bio;
        const dataUpdateUser = yield userService.editUser(userId, name, username, bio);
        res.status(200).json(dataUpdateUser);
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.editUser = editUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        const { userId } = params;
        const dataUser = yield userService.getUser(userId);
        res.status(200).json(dataUser);
    }
    catch (error) {
        console.log(error);
        const err = error;
        res.status(500).json({
            message: err.message,
        });
    }
});
exports.getUser = getUser;
function searchUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const condition = req.body.condition;
            res.status(200).json(yield userService.searchUser(condition));
        }
        catch (error) {
            console.log(error);
            return (0, errorHandler_1.errorHandler)(error, res);
        }
    });
}
exports.searchUser = searchUser;
function findSuggest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = res.locals.userId;
            res.status(200).json(yield userService.getSuggest(userId));
        }
        catch (error) {
            console.log(error);
            return (0, errorHandler_1.errorHandler)(error, res);
        }
    });
}
exports.findSuggest = findSuggest;
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = res.locals.userId;
            res.status(200).json(yield userService.getProfile(userId));
        }
        catch (error) {
            console.log(error);
            return (0, errorHandler_1.errorHandler)(error, res);
        }
    });
}
exports.getProfile = getProfile;
function editUserAttachment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.userId;
            const files = req.files;
            const result = yield userService.editUserAttachment(id, files);
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            (0, errorHandler_1.errorHandler)(error, res);
        }
    });
}
exports.editUserAttachment = editUserAttachment;
