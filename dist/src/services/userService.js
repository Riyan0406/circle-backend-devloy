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
exports.editUserAttachment = exports.getSuggest = exports.getProfile = exports.getLoginUser = exports.getSingleUser = exports.searchUser = exports.getUser = exports.deleteUser = exports.editUser = exports.createUser = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const uuid_1 = require("uuid");
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const fs = __importStar(require("fs"));
function createUser(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuid = (0, uuid_1.v4)();
        const userUUID = uuid.substring(0, 8).replace(/-/g, "");
        const username = `User_${userUUID}`;
        const newUser = yield db_1.default.user.create({
            data: body
        });
        yield db_1.default.profile.create({
            data: {
                userId: newUser.id,
                username: username,
                avatar: "https://res.cloudinary.com/dbzdxsmvy/image/upload/v1715825082/default/oubwrmv1cmteup0iuu7a.png",
                cover: "https://res.cloudinary.com/dbzdxsmvy/image/upload/v1715825082/default/h9avlwzp3lj3hlunlzbc.webp",
                bio: ""
            }
        });
        return newUser;
    });
}
exports.createUser = createUser;
function editUser(id, name, username, bio) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisUser = yield db_1.default.user.findFirst({
            where: {
                id
            },
            include: {
                profile: true
            }
        });
        if (!thisUser) {
            throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
        }
        yield db_1.default.user.update({
            where: {
                id
            },
            data: {
                fullname: name
            }
        });
        yield db_1.default.profile.update({
            where: {
                userId: thisUser.id
            },
            data: {
                username,
                bio
            }
        });
        return `Update profile with id ${id} success!`;
    });
}
exports.editUser = editUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const thisUser = yield db_1.default.user.findFirst({
        where: {
            id
        }
    });
    if (!thisUser) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    yield db_1.default.user.delete({
        where: {
            id
        }
    });
    return `Success delete user with ID ${id}`;
});
exports.deleteUser = deleteUser;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
        where: {
            id
        }
    });
});
exports.getUser = getUser;
function searchUser(condition) {
    return __awaiter(this, void 0, void 0, function* () {
        const allData = yield db_1.default.user.findMany({
            select: {
                id: true,
                fullname: true,
                profile: {
                    select: {
                        username: true,
                        avatar: true,
                        cover: true,
                        bio: true
                    }
                }
            }
        });
        const filteredData = allData.filter((data) => {
            var _a;
            if (!condition) {
                return false;
            }
            const dataFullname = data.fullname.toLowerCase();
            const dataUsername = (_a = data.profile) === null || _a === void 0 ? void 0 : _a.username.toLowerCase();
            return dataFullname.includes(condition.toLowerCase()) || (dataUsername === null || dataUsername === void 0 ? void 0 : dataUsername.includes(condition.toLowerCase()));
        });
        return filteredData;
    });
}
exports.searchUser = searchUser;
const getSingleUser = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
        where: condition
    });
});
exports.getSingleUser = getSingleUser;
const getLoginUser = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
        where: {
            OR: [
                { fullname: condition },
                { email: condition }
            ]
        }
    });
});
exports.getLoginUser = getLoginUser;
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.user.findFirst({
        where: {
            id: userId
        },
        include: {
            profile: true,
            following: true,
            followedBy: true,
            threads: {
                where: {
                    threadId: null
                },
                include: {
                    author: {
                        include: {
                            profile: true
                        }
                    },
                    image: {
                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    _count: {
                        select: {
                            replies: true
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            _count: {
                select: {
                    followedBy: true,
                    following: true
                }
            }
        }
    });
});
exports.getProfile = getProfile;
function getSuggest(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const take = 5;
        const skip = Math.round(Math.random() * take);
        return yield db_1.default.user.findMany({
            where: {
                NOT: {
                    id: userId
                }
            },
            take,
            skip,
            include: {
                profile: true,
                followedBy: true,
                following: true
            }
        });
    });
}
exports.getSuggest = getSuggest;
function editUserAttachment(id, files) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updates = {};
            if (files.avatar && files.avatar.length > 0) {
                const avatar = files.avatar[0];
                const upload = yield cloudinaryConfig_1.default.uploader.upload(avatar.path, {
                    folder: 'avatar'
                });
                updates.avatar = upload.secure_url;
                fs.unlinkSync(avatar.path);
            }
            if (files.cover && files.cover.length > 0) {
                const cover = files.cover[0];
                const upload = yield cloudinaryConfig_1.default.uploader.upload(cover.path, {
                    folder: 'cover'
                });
                updates.cover = upload.secure_url;
                fs.unlinkSync(cover.path);
            }
            yield db_1.default.profile.update({
                where: {
                    userId: id
                },
                data: updates
            });
            return `Success update profile picture or cover with user ID ${id}`;
        }
        catch (error) {
            throw new Error(`Failed to update profile attachment: ${error.message}`);
        }
    });
}
exports.editUserAttachment = editUserAttachment;
