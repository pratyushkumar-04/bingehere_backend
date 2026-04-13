import express from "express";

import * as auth from "../controllers/auth.controller.js";
import * as movie from "../controllers/movie.controller.js";
import * as theatre from "../controllers/theatre.controller.js";
import * as show from "../controllers/show.controller.js";
import * as booking from "../controllers/booking.controller.js";
import * as screen from "../controllers/screen.controller.js";
import * as food from "../controllers/food.controller.js";
import * as order from "../controllers/order.controller.js";

import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

// AUTH
router.post("/register", auth.register);
router.post("/login", auth.login);

// MOVIES
router.post("/movies", attachUser, movie.createMovie);
router.get("/movies/search", movie.searchMovies);
router.get("/movies", movie.getMovies);
router.get("/movies/:id", movie.getMovieById);

// THEATRES
router.post("/theatres", attachUser, theatre.createTheatre);
router.get("/theatres", theatre.getTheatres);

//Screens
router.post("/screens", attachUser, screen.createScreen);

// FOOD
router.post("/foods", attachUser, food.createFood);
router.get("/foods", food.getFoods);
router.get("/foods/:id", food.getFoodById);

// SHOWS
router.post("/shows", attachUser, show.createShow);
router.get("/shows/movie/:movieId", show.getShowsByMovie);

// BOOKINGS
router.post("/bookings", attachUser, booking.createBooking);
router.get("/bookings", attachUser, booking.getUserBookings);

// ORDERS
router.post("/orders", attachUser, order.createOrder);
router.get("/orders", attachUser, order.getOrders);
router.get("/my-orders", attachUser, order.getUserOrders);

export default router;
