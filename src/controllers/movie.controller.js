import Movie from "../models/movie.models.js";
import { searchTMDBMovies, fetchMovieFromTMDB } from "../utils/tmdb.js";

// ADMIN ONLY
// export const createMovie = async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Only admin can add movies" });
//     }

//     const { tmdbId, name, description, genre, duration, language } = req.body;

//     // Fetch poster/banner from TMDB
//     let poster = req.body.poster;
//     let banner = req.body.banner;
//     if (tmdbId) {
//       const tmdbData = await fetchMovieFromTMDB(tmdbId);
//       poster = tmdbData.poster_path;
//       banner = tmdbData.backdrop_path;
//     }
//     const movie = await Movie.create({
//       name,
//       description,
//       genre,
//       duration,
//       language,
//       poster,
//       banner,
//     });

//     res.status(201).json(movie);
//   } catch (err) {
//     console.error("Error creating movie:", err); // 🔥 log full error
//     res.status(500).json({ error: err.message });
//   }
// };

export const createMovie = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add movies" });
    }
    const { tmdbId, name, description, genre, duration, language } = req.body;
    // Fetch poster/banner from TMDB
    let poster = req.body.poster;
    let banner = req.body.banner;

    if (tmdbId) {
      const tmdbData = await fetchMovieFromTMDB(tmdbId);

      // ✅ FIX: Use fallbacks! If TMDB returns undefined, keep what the frontend sent.
      // If the frontend also has nothing, use a placeholder. This guarantees Mongoose validation never fails!
      poster =
        tmdbData && tmdbData.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
          : req.body.poster ||
            "https://via.placeholder.com/500x750?text=No+Poster";

      banner =
        tmdbData && tmdbData.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}`
          : req.body.banner ||
            "https://via.placeholder.com/1280x720?text=No+Banner";
    }

    const movie = await Movie.create({
      tmdbId,
      name,
      description,
      genre,
      duration,
      language,
      poster,
      banner,
    });
    res.status(201).json(movie);
  } catch (err) {
    console.error("Error creating movie:", err); // logs the full error
    res.status(500).json({ error: err.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMoviesFromTMDB = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });
    const movies = await searchTMDBMovies(query);
    res.json(movies); // must return array
  } catch (err) {
    console.error(err); // log backend error
    res.status(500).json({ error: err.message });
  }
};
