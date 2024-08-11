import { Request, Response } from "express";
import * as threadService from "../services/threadService";
import { errorHandler } from "../utils/errorHandler";

export const createThread = async (req: Request, res: Response) => {
   try {
      const content = req.body.content;
      const userId = req.query.userId as string;
      const threadId = req.query.threadId as string | null;

      res.status(200).json(await threadService.createThread(userId, threadId, content));
   } catch (error) {
      console.log(error);

      errorHandler(error, res);
   }
};

export async function createThreadWImage(req: Request, res: Response) {
   try {
      const content = req.body.content;
      const userId = req.query.userId as string;
      const threadId = req.query.threadId as string | null;

      const files = req.files as {
         [fieldname: string]: Express.Multer.File[];
      };

      res.status(200).json(await threadService.createThreadWImage(userId, threadId, content, files));
   } catch (error) {
      console.log(error);

      errorHandler(error, res);
   }
}

export const getThreads = async (req: Request, res: Response) => {
   try {
      res.status(200).json(await threadService.getThreads());
   } catch (error) {
      console.log(error);

      errorHandler(error, res);
   }
};

export const getReplies = async (req: Request, res: Response) => {
   try {
      const threadId = req.params.threadId;
      res.status(200).json(await threadService.getReplies(threadId));
   } catch (error) {
      console.log(error);

      errorHandler(error, res);
   }
};
