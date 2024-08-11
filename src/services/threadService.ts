import { Thread } from "@prisma/client";
import db from "../lib/db";
import cloudinary from "../cloudinaryConfig";
import * as fs from "fs";

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

export async function createThread(userId: string, threadId: string | null, content: string) {
   console.log("pepe", threadId);

   if (threadId === null || !(await db.thread.findUnique({ where: { id: threadId } }))) {
      // Jika threadId adalah null atau tidak ditemukan di database, buat thread baru tanpa parent thread
      return await db.thread.create({
         data: {
            content,
            userId
         },
      });
   }

   // Jika threadId valid, buat thread dengan parent thread
   return await db.thread.create({
      data: {
         content,
         userId,
         threadId
      },
   });
}

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

export async function createThreadWImage(userId: string, threadId: string | null, content: string, files: { [fieldname: string]: Express.Multer.File[]; }) {
   let thread;

   if (threadId === null || !(await db.thread.findUnique({ where: { id: threadId } }))) {
      // Jika threadId adalah null atau tidak ditemukan, buat thread tanpa parent thread
      thread = await db.thread.create({
         data: {
            content,
            userId,
         },
      });
   } else {
      // Jika threadId valid, buat thread dengan parent thread
      thread = await db.thread.create({
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
      const uploadPromises = files.image.map(async (image) => {
         try {
            // Upload gambar ke Cloudinary
            const cloudinaryUploader = await cloudinary.uploader.upload(image.path, {
               folder: "thread-images",
            });

            // Buat entry di threadImage untuk menyimpan URL gambar
            await db.threadImage.create({
               data: {
                  url: cloudinaryUploader.secure_url,
                  threadId: thread.id,
               },
            });

            // Hapus file lokal setelah diupload
            fs.unlinkSync(image.path);
         } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
         }
      });

      // Tunggu semua upload selesai
      await Promise.all(uploadPromises);
   }

   return thread;
}

export async function getThreads() {
   return await db.thread.findMany({
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
}

export async function getReplies(threadId: string) {
   return await db.thread.findMany({
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
}