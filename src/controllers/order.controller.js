import Order from "../models/order.models.js";

// USER ONLY
export const createOrder = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can place orders" });
    }

    const { orderedItems } = req.body;

    if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
      return res.status(400).json({ message: "orderedItems is required" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderedItems,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user")
      .populate("orderedItems.food");

    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// USER ONLY
export const getUserOrders = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can view their orders" });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("user")
      .populate("orderedItems.food");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN ONLY
export const getOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view all orders" });
    }

    const orders = await Order.find()
      .populate("user")
      .populate("orderedItems.food");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
