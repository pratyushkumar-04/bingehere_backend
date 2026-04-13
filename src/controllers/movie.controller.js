import Movie from "../models/movie.models.js";

// ADMIN ONLY
export const createMovie = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add movies" });
    }

    const movie = await Movie.create(req.body);
    res.status(201).json(movie);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMovies = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.json([]);
    }

    const tmdbApiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_KEY;

    if (!tmdbApiKey) {
      return res.status(500).json({ message: "TMDB API key is not configured." });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to search movies." });
    }

    const data = await response.json();

    const results = (data.results || []).slice(0, 8).map((movie) => ({
      id: movie.id,
      title: movie.title || movie.name || "Untitled",
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      original_language: movie.original_language,
      overview: movie.overview,
    }));

    res.json(results);
  } catch (err) {
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
