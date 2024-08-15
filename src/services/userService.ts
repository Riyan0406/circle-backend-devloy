import { User } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../cloudinaryConfig";
import * as fs from "fs";

export async function createUser(body: User): Promise<User> {
   const uuid = uuidv4();
   const userUUID = uuid.substring(0, 8).replace(/-/g, "");
   const username = `User_${userUUID}`;

   const newUser = await db.user.create({
      data: body
   });

   await db.profile.create({
      data: {
         userId: newUser.id,
         username: username,
         avatar: "",
         cover: "",
         bio: ""
      }
   });

   return newUser;
}

export async function editUser(id: string, name: string, username: string, bio: string) {
   const thisUser = await db.user.findFirst({
      where: {
         id
      },
      include: {
         profile: true
      }
   });

   if (!thisUser) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
   }

   await db.user.update({
      where: {
         id
      },
      data: {
         fullname: name
      }
   });

   await db.profile.update({
      where: {
         userId: thisUser.id
      },
      data: {
         username,
         bio
      }
   });

   return `Update profile with id ${id} success!`;
}

export const deleteUser = async (id: string): Promise<string> => {
   const thisUser = await db.user.findFirst({
      where: {
         id
      }
   });

   if (!thisUser) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
   }

   await db.user.delete({
      where: {
         id
      }
   });

   return `Success delete user with ID ${id}`;
};

export const getUser = async (id: string): Promise<User | null> => {
   return db.user.findFirst({
      where: {
         id
      }
   });
};

export async function searchUser(condition: string) {
   interface IProfile {
      username: string;
      avatar: string;
      cover: string;
      bio: string;
   }

   interface IUser {
      id: string;
      fullname: string;
      email: string;
      password: string;
      profile: IProfile | null;
   }


   const allData = await db.user.findMany({
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
      if (!condition) {
         return false;
      }

      const dataFullname = data.fullname.toLowerCase();
      const dataUsername = data.profile?.username.toLowerCase();

      return dataFullname.includes(condition.toLowerCase()) || dataUsername?.includes(condition.toLowerCase());
   });

   return filteredData;
}

export const getSingleUser = async (condition: {
   [key: string]: string;
}): Promise<User | null> => {
   return db.user.findFirst({
      where: condition
   });
};

export const getLoginUser = async (condition: string): Promise<User | null> => {
   return db.user.findFirst({
      where: {
         OR: [
            { fullname: condition },
            { email: condition }
         ]
      }
   });
};

export const getProfile = async (userId: string): Promise<User | null> => {
   return await db.user.findFirst({
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
};

export async function getSuggest(userId: string): Promise<User[]> {
   const take = 5;
   const skip = Math.round(Math.random() * take);
   return await db.user.findMany({
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
}

export async function editUserAttachment(id: string, files: { [fieldname: string]: Express.Multer.File[]; }) {
   try {
      const updates: { avatar?: string; cover?: string; } = {};

      if (files.avatar && files.avatar.length > 0) {
         const avatar = files.avatar[0];
         const upload = await cloudinary.uploader.upload(avatar.path, {
            folder: 'avatar'
         });

         updates.avatar = upload.secure_url;
         fs.unlinkSync(avatar.path);
      }

      if (files.cover && files.cover.length > 0) {
         const cover = files.cover[0];
         const upload = await cloudinary.uploader.upload(cover.path, {
            folder: 'cover'
         });

         updates.cover = upload.secure_url;
         fs.unlinkSync(cover.path);
      }

      await db.profile.update({
         where: {
            userId: id
         },
         data: updates
      });

      return `Success update profile picture or cover with user ID ${id}`;
   } catch (error: any) {
      throw new Error(`Failed to update profile attachment: ${error.message}`);
   }
}
