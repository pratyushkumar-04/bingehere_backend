import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      state: String,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "owner", "user"],
      default: "user",
    },

    ownedTheatres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
      },
    ],
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
