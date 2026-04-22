import Booking from "../models/booking.models.js";
import Show from "../models/show.models.js";

// USER ONLY
// export const createBooking = async (req, res) => {
//   try {
//     if (req.user.role !== "user") {
//       return res.status(403).json({ message: "Only users can book tickets" });
//     }

//     const { showId, seats } = req.body;

//     const show = await Show.findById(showId);

//     if (!show) {
//       return res.status(404).json({ message: "Show not found" });
//     }

//     // check already booked
//     const isBooked = seats.some(seat =>
//       show.bookedSeats.includes(seat)
//     );

//     if (isBooked) {
//       return res.status(400).json({ message: "Some seats already booked" });
//     }

//     // update seats
//     show.bookedSeats.push(...seats);
//     await show.save();

//     const booking = await Booking.create({
//       user: req.user._id,
//       show: showId,
//       seats,
//       totalPrice: seats.length * show.price,
//       paymentStatus: "completed"
//     });

//     res.status(201).json(booking);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can book tickets" });
    }

    // 🔥 Added totalPrice to what we destructure from req.body
    const { showId, seats, totalPrice } = req.body;

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // check already booked
    const isBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (isBooked) {
      return res.status(400).json({ message: "Some seats already booked" });
    }

    // update seats
    show.bookedSeats.push(...seats);
    await show.save();

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice: totalPrice, // 🔥 Use the calculated price sent from frontend
      paymentStatus: "completed"
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

    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "show",
        populate: ["movie", "theatre"]
      });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};