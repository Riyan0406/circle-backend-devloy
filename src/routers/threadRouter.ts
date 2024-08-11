import { Router } from "express";
import * as threadController from "../controllers/threadController";
import uploadMiddleware from "../middlewares/upload";
import authentication from "../middlewares/authentication";

const threadRouter = Router();

threadRouter.get("/", threadController.getThreads);

threadRouter.post(
   "/createThread",
   authentication,
   uploadMiddleware(),
   threadController.createThread
);

threadRouter.post(
   "/createThread/WImage",
   authentication,
   uploadMiddleware(),
   threadController.createThreadWImage
);

threadRouter.get(
   "/replies/:threadId",
   authentication,
   threadController.getReplies
);

export default threadRouter;
