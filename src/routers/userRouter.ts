import { Router } from "express";
import * as userController from "../controllers/userController";
import authentication from "../middlewares/authentication";
import uploadMiddleware from "../middlewares/upload";

const userRouter = Router();

userRouter.get("/single/:userId", authentication, userController.getUser);
userRouter.post("/", userController.createUser);
userRouter.patch("/:userId", authentication, uploadMiddleware(), userController.editUser);

userRouter.patch("/attachment/:userId", authentication, uploadMiddleware(), userController.editUserAttachment);

userRouter.delete("/:userId", userController.deleteUser);
userRouter.post("/friend/search", authentication, userController.searchUser);
userRouter.get("/findSuggest", authentication, userController.findSuggest);
userRouter.get("/profile/getProfile", authentication, userController.getProfile);

export default userRouter;