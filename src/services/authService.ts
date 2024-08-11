import * as userService from "./userService"
import { User } from "@prisma/client"
import { ERROR_MESSAGE } from "../utils/constant/error"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import registerSchema from "../validation/registerValidation"
import loginSchema from "../validation/loginValidation"

export async function register(body: User): Promise<{ id: string }> {
   const { error, value } = registerSchema.validate(body)
   if (error?.details) {
      console.log(error)
      throw new Error(ERROR_MESSAGE.WRONG_INPUT)
   }

   const existEmail = await userService.getSingleUser({
      email: value.email,
   })

   if (existEmail) {
      throw new Error(ERROR_MESSAGE.EXISTED_DATA)
   }

   const hashedPassword = await bcrypt.hash(value.password, 10)

   const user = await userService.createUser({
      ...value,
      password: hashedPassword,
   })

   return { id: user.id }
}

export async function login(body: User): Promise<{ token: string }> {
   const { error, value } = loginSchema.validate(body)

   if (error?.details) {
      console.log(error)
      throw new Error(ERROR_MESSAGE.WRONG_INPUT)
   }

   const condition = value.condition

   const existUser = await userService.getLoginUser(condition)

   if (!existUser) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
   }

   const isMatchPassword = await bcrypt.compare(value.password, existUser.password)
   
   if (!isMatchPassword) {
      throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND)
   }

   const token = jwt.sign(existUser, process.env.SECRET_KEY!, {
      expiresIn: "1d",
   })

   return { token }
}