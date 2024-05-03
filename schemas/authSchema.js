import Joi from "joi";

export const authSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email(),
});

// export const loginSchema = Joi.object({});
