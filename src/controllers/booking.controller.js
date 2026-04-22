import Booking from "../models/booking.models.js";
import Food from "../models/food.models.js";
import Order from "../models/order.models.js";
import Show from "../models/show.models.js";

const normalizeFoodItems = (foodItems = []) => {
  if (!Array.isArray(foodItems)) return [];

  return foodItems
    .map((item) => {
      const food_id = item.food_id || item.foodId || item.food;
      const quantity = Number(item.quantity || 1);

      return {
        food_id,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      };
    })
    .filter((item) => item.food_id);
};

const buildBookingFoodItems = async (foodItems = []) => {
  const normalizedItems = normalizeFoodItems(foodItems);

  if (normalizedItems.length === 0) return [];

  const foodIds = normalizedItems.map((item) => item.food_id);
  const foods = await Food.find({
    _id: { $in: foodIds },
    isAvailable: true,
  });
  const foodMap = new Map(foods.map((food) => [food._id.toString(), food]));

  if (foodMap.size !== new Set(foodIds.map(String)).size) {
    throw new Error("One or more food items are invalid or unavailable");
  }

  return normalizedItems.map((item) => {
    const food = foodMap.get(item.food_id.toString());
    const total = food.price * item.quantity;

    return {
      food_id: food._id,
      name: food.name,
      price: food.price,
      quantity: item.quantity,
      total,
    };
  });
};

// USER ONLY
export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can book tickets" });
    }

    const { showId, seats, totalPrice, foodItems } = req.body;

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "At least one seat is required" });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const isBooked = seats.some((seat) => show.bookedSeats.includes(seat));
    if (isBooked) {
      return res.status(400).json({ message: "Some seats already booked" });
    }

    const bookingFoodItems = await buildBookingFoodItems(foodItems);
    const foodTotal = bookingFoodItems.reduce((sum, item) => sum + item.total, 0);

    show.bookedSeats.push(...seats);
    await show.save();

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      foodItems: bookingFoodItems,
      totalPrice: totalPrice ?? foodTotal,
      paymentStatus: "completed",
    });

    if (bookingFoodItems.length > 0) {
      await Order.create({
        user: req.user._id,
        booking: booking._id,
        theatre: show.theatre,
        seats,
        orderedItems: bookingFoodItems.map((item) => ({
          food: item.food_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
        totalAmount: foodTotal,
        paymentStatus: "completed",
        orderStatus: "confirmed",
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "show",
        populate: ["movie", "theatre"],
      })
      .populate("foodItems.food_id");

    res.status(201).json(populatedBooking);
  } catch (err) {
    const status = err.message.includes("invalid or unavailable") ? 400 : 500;
    res.status(status).json({ error: err.message });
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
        populate: ["movie", "theatre"],
      })
      .populate("foodItems.food_id");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
