import Food from "../models/food.models.js";
import Theatre from "../models/theatre.models.js";

const buildSlug = (name, theatreId) => {
  const baseSlug = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = theatreId ? `-${theatreId.toString().slice(-6)}` : "";

  return `${baseSlug || "food"}${suffix}`;
};

const ensureOwnerCanManageTheatre = async (user, theatreId) => {
  if (user.role !== "owner") return;

  if (!theatreId) {
    throw new Error("Theatre is required for owner food items");
  }

  const theatre = await Theatre.findById(theatreId);

  if (!theatre) {
    throw new Error("Theatre not found");
  }

  if (theatre.owner?.toString() !== user._id.toString()) {
    throw new Error("You can only add food items for your own theatre");
  }
};

// ADMIN OR THEATRE OWNER
export const createFood = async (req, res) => {
  try {
    if (!["admin", "owner"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only admin or owner can add food items" });
    }

    await ensureOwnerCanManageTheatre(req.user, req.body.theatre);

    const foodData = {
      ...req.body,
      slug: req.body.slug || buildSlug(req.body.name, req.body.theatre),
    };

    const food = await Food.create(foodData);
    const populatedFood = await Food.findById(food._id).populate("theatre");

    res.status(201).json(populatedFood);
  } catch (err) {
    const status = err.message.includes("own theatre") ||
      err.message.includes("Theatre is required") ||
      err.message.includes("Theatre not found")
      ? 400
      : 500;
    res.status(status).json({ error: err.message });
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
