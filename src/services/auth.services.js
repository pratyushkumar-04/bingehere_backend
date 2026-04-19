import User from "../models/users.models.js";
import bcrypt from "bcryptjs";

export const updatePassword = async (userId, previousPassword, newPassword) => {
  if (!userId) {
    throw new Error("UserId required");
  }

  if (!previousPassword || !newPassword) {
    throw new Error("Previous and new passwords are required");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(previousPassword, user.password);
  if (!isMatch) {
    throw new Error("Previous password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password updated successfully" };
};
