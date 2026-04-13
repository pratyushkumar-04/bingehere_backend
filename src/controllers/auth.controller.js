import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/mailer.utils.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

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
      location,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      user,
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
      user,
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
      return res
        .status(400)
        .json({ message: "Previous and new passwords are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(previousPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Previous password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. generate OTP
    const otp = generateOTP();

    // 3. hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 4. save OTP + expiry (3 minutes)
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 3 * 60 * 1000; // 3 mins
    user.otpAttempts = 0;

    await user.save();

    // 5. send email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp");
    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // limit attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ message: "Too many attempts" });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // mark verified (temporary flag)
    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;

    await user.save();

    return res.status(200).json({
      message: "OTP verified",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.otpVerified) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otpVerified = false;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
    });
  }
};
