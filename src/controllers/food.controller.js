import Food from "../models/food.models.js";

// ADMIN ONLY
export const createFood = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add food items" });
    }

    const food = await Food.create(req.body);
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ALL USERS
export const getFoods = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.theatreId) {
      filter.theatre = req.query.theatreId;
    }

    if (req.query.available === "true") {
      filter.isAvailable = true;
    }

    if (req.query.available === "false") {
      filter.isAvailable = false;
    }

    const foods = await Food.find(filter).populate("theatre");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("theatre");

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
