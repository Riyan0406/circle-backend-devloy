import { Request, Response } from "express";
import * as followService from "../services/followService";
import { errorHandler } from "../utils/errorHandler";

export async function follow(req: Request, res: Response) {
    try {
        const followingId = req.query.followingId as string;
        const id = res.locals.userId;
        const dataFollow = await followService.follow(id, followingId);
        res.status(200).json({ message: dataFollow });
    } catch (error) {
        console.log(error);
        return errorHandler(error, res);
    }
}