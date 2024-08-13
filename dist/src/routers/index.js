"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./userRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const threadRouter_1 = __importDefault(require("./threadRouter"));
const followRouter_1 = __importDefault(require("./followRouter"));
const likeRouter_1 = __importDefault(require("./likeRouter"));
const indexRouter = (0, express_1.Router)();
indexRouter.use("/user", userRouter_1.default);
indexRouter.use(authRouter_1.default);
indexRouter.use("/threads", threadRouter_1.default);
indexRouter.use("/follow", followRouter_1.default);
indexRouter.use("/like", likeRouter_1.default);
exports.default = indexRouter;
