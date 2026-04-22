import Booking from "../models/booking.models.js";
import Food from "../models/food.models.js";
import Order from "../models/order.models.js";

const normalizeOrderedItems = (orderedItems = []) => {
  if (!Array.isArray(orderedItems)) return [];

  return orderedItems
    .map((item) => {
      const food = item.food || item.food_id || item.foodId;
      const quantity = Number(item.quantity || 1);

      return {
        food,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      };
    })
    .filter((item) => item.food);
};

const buildOrderItems = async (orderedItems = []) => {
  const normalizedItems = normalizeOrderedItems(orderedItems);

  if (normalizedItems.length === 0) {
    throw new Error("orderedItems is required");
  }

  const foodIds = normalizedItems.map((item) => item.food);
  const foods = await Food.find({
    _id: { $in: foodIds },
    isAvailable: true,
  });
  const foodMap = new Map(foods.map((food) => [food._id.toString(), food]));

  if (foodMap.size !== new Set(foodIds.map(String)).size) {
    throw new Error("One or more food items are invalid or unavailable");
  }

  return normalizedItems.map((item) => {
    const food = foodMap.get(item.food.toString());
    const total = food.price * item.quantity;

    return {
      food: food._id,
      name: food.name,
      price: food.price,
      quantity: item.quantity,
      total,
    };
  });
};

const populateOrder = (query) =>
  query
    .populate("user")
    .populate("booking")
    .populate("theatre")
    .populate("orderedItems.food");

export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can place orders" });
    }

    const { bookingId, booking, orderedItems, paymentStatus } = req.body;
    const bookingRef = bookingId || booking;
    const orderItems = await buildOrderItems(orderedItems);
    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

    let bookingData = null;
    let theatreId = req.body.theatre || req.body.theatre_id || null;
    let seats = Array.isArray(req.body.seats) ? req.body.seats : [];

    if (bookingRef) {
      bookingData = await Booking.findById(bookingRef).populate("show");

      if (!bookingData) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (bookingData.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only order for your own booking" });
      }

      seats = bookingData.seats;
      theatreId = bookingData.show?.theatre || theatreId;
    }

    const order = await Order.create({
      user: req.user._id,
      booking: bookingRef || null,
      theatre: theatreId,
      seats,
      orderedItems: orderItems,
      totalAmount,
      paymentStatus: paymentStatus || "completed",
      orderStatus: "confirmed",
    });

    if (bookingData) {
      bookingData.foodItems.push(
        ...orderItems.map((item) => ({
          food_id: item.food,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
      );
      bookingData.totalPrice = (bookingData.totalPrice || 0) + totalAmount;
      await bookingData.save();
    }

    const populatedOrder = await populateOrder(Order.findById(order._id));

    res.status(201).json(populatedOrder);
  } catch (err) {
    const status = err.message.includes("required") ||
      err.message.includes("invalid or unavailable")
      ? 400
      : 500;
    res.status(status).json({ error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can view their orders" });
    }

    const orders = await populateOrder(Order.find({ user: req.user._id }));

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all orders" });
    }

    const orders = await populateOrder(Order.find());

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
