import Booking from "../models/booking.models.js";
import Show from "../models/show.models.js";
import Theatre from "../models/theatre.models.js";
import Screen from "../models/screen.models.js";

// USER ONLY
export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can book tickets" });
    }

    const { showId, seats, date, time, ticketPrice } = req.body;

    let show = null;
    if (showId) {
      show = await Show.findById(showId);
    }

    if (!show) {
      const showStartTime =
        date && time ? new Date(`${date} ${time}`) : new Date();

      show = await Show.create({
        startTime: showStartTime,
        price: typeof ticketPrice === "number" ? ticketPrice : 0,
        bookedSeats: [],
      });
    }

    // check already booked
    const isBooked = seats.some((seat) => show.bookedSeats.includes(seat));

    if (isBooked) {
      return res.status(400).json({ message: "Some seats already booked" });
    }

    // update seats
    show.bookedSeats.push(...seats);
    await show.save();

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      seats,
      totalPrice: seats.length * show.price,
      paymentStatus: "completed",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can view bookings" });
    }

    const bookings = await Booking.find({ user: req.user._id }).populate({
      path: "show",
      populate: ["movie", "theatre"],
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
