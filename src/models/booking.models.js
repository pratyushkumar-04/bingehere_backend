import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    seats: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one seat is required",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    seatTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    foodTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1, bookingStatus: 1 });

export default mongoose.model("Booking", bookingSchema);

// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },

//   show: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Show",
//   },

//   seats: [String],

//   totalPrice: Number,

//   paymentStatus: {
//     type: String,
//     enum: ["pending", "completed"],
//     default: "pending",
//   },

// }, { timestamps: true });

// export default mongoose.model("Booking", bookingSchema);
