import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

export const register = async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    password: newUser.password,
    email: newUser.email,
  });
};

export const login = async (req, res, next) => {};
