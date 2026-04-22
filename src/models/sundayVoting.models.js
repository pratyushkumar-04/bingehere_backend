import mongoose from "mongoose";

const sundayVotingMovieSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SundayVotingSession",
      required: true,
    },
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    year: { type: String },
    poster: { type: String },
    genre: { type: [String] },
    addedByAdmin: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const SundayVotingMovie = mongoose.model(
  "SundayVotingMovie",
  sundayVotingMovieSchema,
);

const sundayVotingSessionSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true, default: Date.now },
    closingDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    userVotes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        tmdbId: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const SundayVotingSession = mongoose.model(
  "SundayVotingSession",
  sundayVotingSessionSchema,
);
