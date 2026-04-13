import express from "express";

import * as auth from "../controllers/auth.controller.js";
import * as movie from "../controllers/movie.controller.js";
import * as theatre from "../controllers/theatre.controller.js";
import * as show from "../controllers/show.controller.js";
import * as booking from "../controllers/booking.controller.js";
import * as screen from "../controllers/screen.controller.js"
import { getShowById } from "../controllers/userDetails.controller.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

// AUTH
router.post("/register", auth.register);
router.post("/login", auth.login);
router.put("/update-password", attachUser, auth.updatePassword);
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password", auth.resetPassword);

// MOVIES
router.post("/movies", attachUser, movie.createMovie);//Admin
router.get("/movies/search", movie.searchMoviesFromTMDB); // ✅ search first
router.get("/movies", movie.getMovies);
router.get("/movies/:id", movie.getMovieById);

// THEATRES
router.post("/theatres", attachUser, theatre.createTheatre);//admin
router.get("/theatres", theatre.getTheatres);

//Screens
router.post("/screens",attachUser,screen.createScreen)

// SHOWS
router.post("/shows", attachUser, show.createShow);
router.get("/shows/movie/:movieId", show.getShowsByMovie);
router.get("/shows/:showId", getShowById);

// BOOKINGS
router.post("/bookings", attachUser, booking.createBooking);
router.get("/bookings", attachUser, booking.getUserBookings);

export default router;
