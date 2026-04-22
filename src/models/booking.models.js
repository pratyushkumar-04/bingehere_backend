
import mongoose from "mongoose";

const bookingFoodItemSchema = new mongoose.Schema(
  {
    food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    name: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      min: 0,
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },

    total: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

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

  foodItems: {
    type: [bookingFoodItemSchema],
    default: [],
  },

  totalPrice: Number,

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
