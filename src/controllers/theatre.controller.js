import Theatre from "../models/theatre.models.js";
import User from "../models/users.models.js";

// ADMIN ONLY
export const createTheatre = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create theatres" });
    }
    const theatre = await Theatre.create(req.body);
    // add to owner's list
    await User.findByIdAndUpdate(theatre.owner, {
      $push: { ownedTheatres: theatre._id }
    });
    res.status(201).json(theatre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ALL USERS
export const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find()
      .populate("owner")
      .populate("screens");

    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};