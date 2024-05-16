import User from "../models/user.js";
import path from "node:path";
import fs from "node:fs/promises";

export const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      _id,
      { avatar: req.file.filename },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
  // const { _id } = req.user;
  // const { path: tmpUpload, originalName } = req.file;
  // const resultUpload = path.join(avatarsDir, originalName);

  // await fs.rename(tmpUpload, resultUpload);

  // const avatarURL = path.join("avatars", originalName);
  // await User.findByIdAndUpdate(_id, { avatarURL });
};
