
import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  location: {
    city: String,
    state: String,
    address: String,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  screens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Theatre", theatreSchema);