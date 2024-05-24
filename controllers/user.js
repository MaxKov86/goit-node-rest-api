import User from "../models/user.js";
import path from "node:path";
import fs from "node:fs/promises";
import jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

const avatarDir = path.resolve("public/avatars");

export const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const avatar = await jimp.read(req.file.path);
    await avatar.resize(250, 250);
    await avatar.writeAsync(path.resolve("public/avatars", req.file.filename));
    await fs.rm(req.file.path);

    const user = await User.findByIdAndUpdate(
      _id,
      { avatarURL: req.file.filename },
      { new: true }
    );
    res.json({ avatarURL: path.join(avatarDir, user.avatarURL) });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken },
      {
        verify: true,
        verificationToken: null,
      },
      { new: true }
    );

    if (user === null) {
      throw HttpError(404);
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendingVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(400, "Missing required field email");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await sendMail({
      to: emailToLowerCase,
      from: "maxkov19861411@gmail.com",
      subject: "Welcome to Phonebook",
      html: `To confirm your email please go to this <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email please open  http://localhost:3000/api/users/verify/${user.verificationToken}`,
    });

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
