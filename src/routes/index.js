import express from "express";

import * as auth from "../controllers/auth.controller.js";
import * as movie from "../controllers/movie.controller.js";
import * as theatre from "../controllers/theatre.controller.js";
import * as show from "../controllers/show.controller.js";
import * as booking from "../controllers/booking.controller.js";
import * as screen from "../controllers/screen.controller.js";
import { getShowById } from "../controllers/userDetails.controller.js";
import attachUser from "../middlewares/attachUser.js";
import * as sundayVoting from "../controllers/sundayVoting.controller.js";

const router = express.Router();

// AUTH
router.post("/register", auth.register);
router.post("/login", auth.login);
router.put("/update-password", attachUser, auth.updatePassword);
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password", auth.resetPassword);

// MOVIES
router.post("/movies", attachUser, movie.createMovie);
router.get("/movies/search", movie.searchMoviesFromTMDB);
router.get("/movies", movie.getMovies);
router.get("/movies/search", movie.searchMovies);
router.get("/movies/by-location", attachUser, movie.getMoviesByLocation);
router.get(
  "/movies/by-location/:category",
  attachUser,
  movie.getMoviesByLocationAndCategory,
);
router.get("/movies/:id", movie.getMovieById);

// THEATRES
router.post("/theatres", attachUser, theatre.createTheatre); //admin
router.get("/theatres", theatre.getTheatres);
router.get("/theatre/:userId", theatre.getTheatresByOwner);

//Screens
router.post("/screens", attachUser, screen.createScreen);

// SHOWS
router.post("/shows", attachUser, show.createShow);
router.get("/shows/movie/:movieId", show.getShowsByMovie);
router.get("/shows/:showId", getShowById);

// BOOKINGS
router.post("/bookings", attachUser, booking.createBooking);
router.get("/bookings", attachUser, booking.getUserBookings);

// SUNDAY VOTING
router.get("/sunday-voting/active", sundayVoting.getActiveSession);
router.post("/sunday-voting/vote", sundayVoting.vote);
router.post("/sunday-voting/nominate", sundayVoting.nominate);
router.post("/sunday-voting/admin/add-movie", sundayVoting.adminAddMovie);
router.get("/sunday-voting/admin/stats", sundayVoting.getAdminStats);
router.get("/sunday-voting/winner", sundayVoting.getWinner);

export default router;
