import { Request, Response } from "express"
import * as authService from "../services/authService"
import * as userService from "../services/userService"
import { errorHandler } from "../utils/errorHandler"
import { User } from "@prisma/client"

export const register = async (req: Request, res: Response) => {
   try {
      const dataRegister = await authService.register(req.body as User)
      res.status(200).json(dataRegister)
   } catch (error) {
      console.log(error)
      return errorHandler(error, res)
   }
}

export const login = async (req: Request, res: Response) => {
   try {
      const dataLogin = await authService.login(req.body as User)
      res.status(200).json(dataLogin)
   } catch (error) {
      console.log(error)
      return errorHandler(error, res)
   }
}

export const authCheck = async (req: Request, res: Response) => {
   try {
      const userId = res.locals.userId
      const dataAuth = await userService.getProfile(userId)

      res.status(200).json(dataAuth)
   } catch (error) {
      return errorHandler(error, res)
   }
}
