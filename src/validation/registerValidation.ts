import joi from "joi"

const registerSchema = joi.object({
   fullname: joi.string().required(),
   email: joi.string().email().required(),
   password: joi.string().required().min(8),
})

export default registerSchema
