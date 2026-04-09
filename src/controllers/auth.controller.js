import User from "../models/users.models.js";
import bcrypt from "bcryptjs";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      location
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN (returns userId instead of token)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id, // use this in headers/body
      role: user.role,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user?._id || req.headers.userid || req.body.userId;
    const { previousPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "UserId required" });
    }

    if (!previousPassword || !newPassword) {
      return res.status(400).json({ message: "Previous and new passwords are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(previousPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Previous password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
