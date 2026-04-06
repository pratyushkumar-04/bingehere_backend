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