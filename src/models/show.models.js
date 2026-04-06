
import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },

  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
  },

  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
  },

  startTime: Date,
  endTime: Date,

  price: Number,

  bookedSeats: [String], // ["A1", "A2"]

}, { timestamps: true });

export default mongoose.model("Show", showSchema);