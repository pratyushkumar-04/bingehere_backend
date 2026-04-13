import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const searchTMDBMovies = async (query) => {
  const { data } = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
    },
  });

  return data.results.map((movie) => ({
    tmdbId: movie.id,
    title: movie.title,
    releaseDate: movie.release_date,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : null,
  }));
};

export const fetchMovieFromTMDB = async (tmdbId) => {
  const { data } = await axios.get(
    `${BASE_URL}/movie/${tmdbId}`,
    {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: "images,credits",
      },
    }
  );

  return {
    name: data.title,
    description: data.overview,
    duration: data.runtime,
    genre: data.genres.map((g) => g.name),
    language: data.original_language,
    releaseDate: data.release_date,
    ratings: data.vote_average,

    poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    banner: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,

    images: data.images.backdrops.map(
      (img) => `https://image.tmdb.org/t/p/original${img.file_path}`
    ),

    cast: data.credits.cast.slice(0, 5).map((c) => ({
      name: c.name,
      role: c.character,
    })),

    director:
      data.credits.crew.find((c) => c.job === "Director")?.name || "",
  };
};