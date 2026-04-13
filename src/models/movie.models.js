import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    banner: String,
    images: [String],

    description: String,

    duration: {
      type: Number, // in minutes
    },

    genre: [String],
    language: String,

    releaseDate: Date,

    director: String,
    cast: [
      {
        name: String,
        role: String,
      },
    ],

    certificate: String,

    ratings: {
      type: Number,
      min: 0,
      max: 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },

    trailerURL: String,

    isNowShowing: {
      type: Boolean,
      default: false,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Movie", movieSchema);
