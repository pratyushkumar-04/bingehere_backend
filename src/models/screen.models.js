
import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  name: String, // Screen 1, Screen 2

  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
  },

  totalSeats: Number,

  seatLayout: [
    {
      row: String,  
      seats: Number,
    },
  ],
}, { timestamps: true });

export default mongoose.model("Screen", screenSchema);