import Joi from "joi"

const loginSchema = Joi.object({
   condition: Joi.string().required(),
   password: Joi.string().required().min(8),
})

export default loginSchema
