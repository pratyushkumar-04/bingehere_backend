import {
  SundayVotingSession,
  SundayVotingMovie,
} from "../models/sundayVoting.models.js";
import Movie from "../models/movie.models.js";

// Helper to get or create the current 15-day session
export const getCurrentSession = async () => {
  let session = await SundayVotingSession.findOne().sort({ createdAt: -1 });

  const now = new Date();

  // A session lasts 15 days. If no session exists or the latest session is older than 15 days, create a new one.
  if (
    !session ||
    now.getTime() - new Date(session.startDate).getTime() >
      15 * 24 * 60 * 60 * 1000
  ) {
    const closingDate = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours for voting
    session = await SundayVotingSession.create({
      startDate: now,
      closingDate: closingDate,
      isActive: true,
      userVotes: [],
    });
  }
  return session;
};

export const getActiveSession = async (req, res) => {
  try {
    const session = await getCurrentSession();

    const movies = await SundayVotingMovie.find({ sessionId: session._id });

    // Filter contenders: admin added OR votes > 100
    const contenders = movies
      .filter((m) => m.addedByAdmin || m.votes > 100)
      .map((m) => ({
        _id: m._id,
        tmdbId: m.tmdbId,
        title: m.title,
        year: m.year,
        poster: m.poster,
        genre: m.genre,
        votes: m.votes,
        addedByAdmin: m.addedByAdmin,
      }));

    let userVote = null;
    const userId = req.headers.userid;
    if (userId) {
      const userVoteRecord = session.userVotes.find(
        (uv) => uv.userId.toString() === userId,
      );
      if (userVoteRecord) {
        userVote = userVoteRecord.tmdbId;
      }
    }

    res.status(200).json({
      closingTime: session.closingDate,
      contenders: contenders,
      userVote: userVote,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching active session" });
  }
};

export const vote = async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const userId = req.headers.userid;

    if (!userId) {
      return res.status(401).json({ message: "UserId required in headers" });
    }

    const session = await getCurrentSession();

    const now = new Date();
    // Allow votes if session active. Check time:
    if (now > new Date(session.closingDate)) {
      return res.status(400).json({ message: "Voting session is closed" });
    }

    const hasVoted = session.userVotes.find(
      (uv) => uv.userId.toString() === userId,
    );
    if (hasVoted) {
      return res
        .status(400)
        .json({ message: "User has already voted in this session" });
    }

    const movie = await SundayVotingMovie.findOne({
      sessionId: session._id,
      tmdbId,
    });

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found in this session" });
    }

    movie.votes += 1;
    await movie.save();

    session.userVotes.push({ userId, tmdbId });
    await session.save();

    res.status(200).json({ message: "Vote cast successfully", movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const nominate = async (req, res) => {
  try {
    const { tmdbId, title, year, poster } = req.body;
    const userId = req.headers.userid;

    if (!userId) {
      return res.status(401).json({ message: "UserId required in headers" });
    }

    const session = await getCurrentSession();

    const now = new Date();
    if (now > new Date(session.closingDate)) {
      return res.status(400).json({ message: "Voting session is closed" });
    }

    const hasVoted = session.userVotes.find(
      (uv) => uv.userId.toString() === userId,
    );
    if (hasVoted) {
      return res.status(400).json({
        message: "User has already voted/nominated in this session",
      });
    }

    let movie = await SundayVotingMovie.findOne({
      sessionId: session._id,
      tmdbId,
    });

    if (!movie) {
      movie = new SundayVotingMovie({
        sessionId: session._id,
        tmdbId,
        title,
        year,
        poster,
        addedByAdmin: false,
        votes: 0,
      });
    }

    movie.votes += 1;
    await movie.save();

    session.userVotes.push({ userId, tmdbId });
    await session.save();

    res.status(200).json({ message: "Nomination successful", movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin route to add a classic movie for voting
export const adminAddMovie = async (req, res) => {
  try {
    const { tmdbId, title, year, poster, genre } = req.body;

    const session = await getCurrentSession();

    let movie = await SundayVotingMovie.findOne({
      sessionId: session._id,
      tmdbId,
    });

    if (movie) {
      return res
        .status(400)
        .json({ message: "Movie already added to this session" });
    }

    movie = new SundayVotingMovie({
      sessionId: session._id,
      tmdbId,
      title,
      year,
      poster,
      genre,
      addedByAdmin: true,
      votes: 0,
    });

    await movie.save();

    res.status(201).json({ message: "Movie added to contenders", movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin route to get detailed stats (including hidden nominations under 100 votes)
export const getAdminStats = async (req, res) => {
  try {
    const session = await SundayVotingSession.findOne().sort({ createdAt: -1 });

    if (!session) {
      return res.status(200).json({ active: false });
    }

    const movies = await SundayVotingMovie.find({ sessionId: session._id });

    // Filter into visible vs hidden
    const contenders = movies.filter((m) => m.addedByAdmin || m.votes > 100);
    const nominations = movies.filter((m) => !m.addedByAdmin && m.votes <= 100);

    res.status(200).json({
      active: true,
      closingTime: session.closingDate,
      contenders: contenders,
      nominations: nominations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint to fetch the winner of the most recently closed session
export const getWinner = async (req, res) => {
  try {
    const now = new Date();
    // Find the most recently closed session
    const closedSession = await SundayVotingSession.findOne({
      closingDate: { $lt: now },
    }).sort({ createdAt: -1 });

    if (!closedSession) {
      return res.status(404).json({
        message: "No closed session found yet. Voting might still be ongoing.",
      });
    }

    const movies = await SundayVotingMovie.find({
      sessionId: closedSession._id,
    });

    if (movies.length === 0) {
      return res.status(404).json({
        message: "No movies found in the most recent closed session.",
      });
    }

    // Find the movie with the highest votes
    const winner = movies.reduce((prev, current) => {
      return prev.votes > current.votes ? prev : current;
    });

    // Check if this winner already exists in the main Movies collection
    let mainMovie = await Movie.findOne({ tmdbId: winner.tmdbId });

    // If it doesn't exist, insert it automatically
    if (!mainMovie) {
      mainMovie = new Movie({
        name: winner.title,
        poster: winner.poster,
        tmdbId: winner.tmdbId,
        genre: winner.genre,
        releaseDate: winner.year ? new Date(winner.year, 0, 1) : null,
        isActive: true, // Making it active for theatre owners to see
      });
      await mainMovie.save();
    }

    // Return the document from the main Movies collection
    res.status(200).json(mainMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
