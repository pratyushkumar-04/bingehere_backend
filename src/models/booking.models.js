
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
  },

  seats: [String],

  totalPrice: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);