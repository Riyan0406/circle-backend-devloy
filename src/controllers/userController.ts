import { Request, Response } from "express";
import * as userService from "../services/userService";
import { errorHandler } from "../utils/errorHandler";

export const createUser = async (req: Request, res: Response) => {
   try {
      const { body } = req;

      const dataInsertUser = await userService.createUser(body);

      res.status(200).json(dataInsertUser);
   } catch (error) {
      console.log(error);

      const err = error as unknown as Error;

      res.status(500).json({
         message: err.message,
      });
   }
};

export const deleteUser = async (req: Request, res: Response) => {
   try {
      const { params } = req;
      const { userId } = params;

      const messageDeleteUser = await userService.deleteUser(userId);

      res.status(200).json({ message: messageDeleteUser });
   } catch (error) {
      console.log(error);

      return errorHandler(error, res);
   }
};

export const editUser = async (req: Request, res: Response) => {
   try {
      const userId = req.params.userId;
      const name = req.body.name;
      const username = req.body.username;
      const bio = req.body.bio;

      const dataUpdateUser = await userService.editUser(userId, name, username, bio);

      res.status(200).json(dataUpdateUser);
   } catch (error) {
      console.log(error);

      const err = error as unknown as Error;

      res.status(500).json({
         message: err.message,
      });
   }
};

export const getUser = async (req: Request, res: Response) => {
   try {
      const { params } = req;
      const { userId } = params;

      const dataUser = await userService.getUser(userId);

      res.status(200).json(dataUser);
   } catch (error) {
      console.log(error);

      const err = error as unknown as Error;

      res.status(500).json({
         message: err.message,
      });
   }
};

export async function searchUser(req: Request, res: Response) {
   try {
      const condition = req.body.condition;
      res.status(200).json(await userService.searchUser(condition));
   } catch (error) {
      console.log(error);
      return errorHandler(error, res);
   }
}

export async function findSuggest(req: Request, res: Response) {
   try {
      const userId = res.locals.userId;
      res.status(200).json(await userService.getSuggest(userId));
   } catch (error) {
      console.log(error);
      return errorHandler(error, res);
   }
}

export async function getProfile(req: Request, res: Response) {
   try {
      const userId = res.locals.userId;
      res.status(200).json(await userService.getProfile(userId));
   } catch (error) {
      console.log(error);
      return errorHandler(error, res);
   }
}

export async function editUserAttachment(req: Request, res: Response) {
   try {
      const id = req.params.userId;
      const files = req.files as { [fieldname: string]: Express.Multer.File[]; };

      const result = await userService.editUserAttachment(id, files);
      res.status(200).json(result);
   } catch (error) {
      console.log(error);
      errorHandler(error, res);
   }
}
