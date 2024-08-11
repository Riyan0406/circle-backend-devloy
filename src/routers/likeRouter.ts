import { Router } from "express"
import * as likeController from "../controllers/likeController"
import authentication from "../middlewares/authentication"

const likeRouter = Router()

likeRouter.post("/:threadID", authentication, likeController.like)
likeRouter.get("/check/:threadID", authentication, likeController.checkLike)

export default likeRouter