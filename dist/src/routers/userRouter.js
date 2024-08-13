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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const userRouter = (0, express_1.Router)();
userRouter.get("/single/:userId", authentication_1.default, userController.getUser);
userRouter.post("/", userController.createUser);
userRouter.patch("/:userId", authentication_1.default, (0, upload_1.default)(), userController.editUser);
userRouter.patch("/attachment/:userId", authentication_1.default, (0, upload_1.default)(), userController.editUserAttachment);
userRouter.delete("/:userId", userController.deleteUser);
userRouter.post("/friend/search", authentication_1.default, userController.searchUser);
userRouter.get("/findSuggest", authentication_1.default, userController.findSuggest);
userRouter.get("/profile/getProfile", authentication_1.default, userController.getProfile);
exports.default = userRouter;
