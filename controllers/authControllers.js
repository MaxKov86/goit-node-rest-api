import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import { sendMail } from "../mail.js";

dotenv.config();

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailToLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailToLowerCase });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    sendMail({
      to: emailToLowerCase,
      from: "maxkov19861411@gmail.com",
      subject: "Welcome to Phonebook",
      html: `To confirm your email please go to this <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open  http://localhost:3000/api/users/verify/${verificationToken}`,
    });
    res.status(201).json({
      user: { subscription: newUser.subscription, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailToLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailToLowerCase });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = { id: user._id };

    if (user.verify === false) {
      throw HttpError(401, "Please verify your email");
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: { subscription: user.subscription, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json({ message: "No content" });
  } catch (error) {
    next(error);
  }
};
