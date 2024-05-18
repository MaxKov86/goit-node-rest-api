import User from "../models/user.js";
import path from "node:path";
import fs from "node:fs/promises";
import jimp from "jimp";

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
    res.json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
};
