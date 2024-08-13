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
exports.getReplies = exports.getThreads = exports.createThreadWImage = exports.createThread = void 0;
const db_1 = __importDefault(require("../lib/db"));
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const fs = __importStar(require("fs"));
// export async function createThread(userId: string, threadId: string | null, content: string) {
//    console.log("pepe", threadId);
//    if (threadId === null) {
//       return await db.thread.create({
//          data: {
//             content,
//             userId
//          },
//       });
//    }
//    return await db.thread.create({
//       data: {
//          content,
//          userId,
//          threadId
//       },
//    });
// }
function createThread(userId, threadId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("pepe", threadId);
        if (threadId === null || !(yield db_1.default.thread.findUnique({ where: { id: threadId } }))) {
            // Jika threadId adalah null atau tidak ditemukan di database, buat thread baru tanpa parent thread
            return yield db_1.default.thread.create({
                data: {
                    content,
                    userId
                },
            });
        }
        // Jika threadId valid, buat thread dengan parent thread
        return yield db_1.default.thread.create({
            data: {
                content,
                userId,
                threadId
            },
        });
    });
}
exports.createThread = createThread;
// export async function createThreadWImage(userId: string, threadId: string | null, content: string, files: { [fieldname: string]: Express.Multer.File[]; }) {
//    const thread = await db.thread.create({
//       data: {
//          content,
//          userId,
//          threadId
//       },
//    });
//    if (Array.from(files.image)) {
//       files.image.map(async (image) => {
//          const cloudinaryUploader = await cloudinary.uploader.upload(image.path, {
//             folder: "thread-images"
//          });
//          await db.threadImage.createMany({
//             data: {
//                url: cloudinaryUploader.secure_url,
//                threadId: thread.id,
//             },
//          });
//          fs.unlinkSync(image.path);
//       });
//    }
//    return thread;
// }
function createThreadWImage(userId, threadId, content, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let thread;
        if (threadId === null || !(yield db_1.default.thread.findUnique({ where: { id: threadId } }))) {
            // Jika threadId adalah null atau tidak ditemukan, buat thread tanpa parent thread
            thread = yield db_1.default.thread.create({
                data: {
                    content,
                    userId,
                },
            });
        }
        else {
            // Jika threadId valid, buat thread dengan parent thread
            thread = yield db_1.default.thread.create({
                data: {
                    content,
                    userId,
                    threadId,
                },
            });
        }
        // Periksa jika ada file gambar yang diupload
        if (files.image && files.image.length > 0) {
            // Gunakan Promise.all untuk menunggu semua proses upload selesai
            const uploadPromises = files.image.map((image) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Upload gambar ke Cloudinary
                    const cloudinaryUploader = yield cloudinaryConfig_1.default.uploader.upload(image.path, {
                        folder: "thread-images",
                    });
                    // Buat entry di threadImage untuk menyimpan URL gambar
                    yield db_1.default.threadImage.create({
                        data: {
                            url: cloudinaryUploader.secure_url,
                            threadId: thread.id,
                        },
                    });
                    // Hapus file lokal setelah diupload
                    fs.unlinkSync(image.path);
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    throw new Error('Failed to upload image');
                }
            }));
            // Tunggu semua upload selesai
            yield Promise.all(uploadPromises);
        }
        return thread;
    });
}
exports.createThreadWImage = createThreadWImage;
function getThreads() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.thread.findMany({
            where: {
                threadId: null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullname: true,
                        profile: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                                cover: true,
                                bio: true,
                                userId: true
                            }
                        }
                    }
                },
                image: {
                    select: {
                        id: true,
                        url: true
                    }
                },
                replies: {
                    include: {
                        author: {
                            include: {
                                profile: true
                            }
                        },
                        _count: {
                            select: {
                                like: true,
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        like: true,
                        replies: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    });
}
exports.getThreads = getThreads;
function getReplies(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.default.thread.findMany({
            where: {
                threadId: threadId
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullname: true,
                        profile: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                                cover: true,
                                bio: true,
                                userId: true
                            }
                        }
                    }
                },
                image: {
                    select: {
                        id: true,
                        url: true
                    }
                },
                replies: {
                    include: {
                        author: {
                            include: {
                                profile: true
                            }
                        },
                        _count: {
                            select: {
                                like: true,
                                replies: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        like: true,
                        replies: true
                    }
                }
            }
        });
    });
}
exports.getReplies = getReplies;
