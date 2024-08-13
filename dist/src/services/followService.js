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
exports.follow = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
function follow(id, followingID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (followingID === id) {
            throw new Error("Follow denied!");
        }
        const userTFollow = yield db_1.default.user.findFirst({
            where: {
                id: followingID
            }
        });
        if (!userTFollow) {
            throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
        }
        const existFollow = yield db_1.default.follow.findFirst({
            where: {
                followedById: id,
                followingId: followingID
            }
        });
        if (existFollow) {
            yield db_1.default.follow.deleteMany({
                where: {
                    followedById: id,
                    followingId: followingID
                }
            });
            return `Success unfollow user with ID ${followingID}`;
        }
        yield db_1.default.follow.create({
            data: {
                followedById: id,
                followingId: followingID
            }
        });
        return `Success follow user with ID ${followingID}`;
    });
}
exports.follow = follow;
