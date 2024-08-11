import { Request, Response } from "express"
import * as likeService from "../services/likeService"
import { errorHandler } from "../utils/errorHandler"

export async function like(req: Request, res: Response) {
    try {
        const userID = res.locals.userId
        const { threadID } = req.params
        const dataLike = await likeService.like(userID, threadID)
        res.status(200).json({ message: dataLike })
    } catch (error) {
        console.log(error)
        return errorHandler(error, res)
    }
}

export async function checkLike(req: Request, res: Response) {
    try {
        const userID = res.locals.userId
        const { threadID } = req.params
        const dataLike = await likeService.checkLike(userID, threadID)
        res.status(200).json( dataLike )
    } catch (error) {
        console.log(error)
        return errorHandler(error, res)
    }
}