import Show from "../models/show.models.js";
import Theatre from "../models/theatre.models.js";

// OWNER ONLY
export const createShow = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can create shows" });
    }

    const { theatre } = req.body;

    const theatreData = await Theatre.findById(theatre);

    if (!theatreData) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    // ownership check
    if (theatreData.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your theatre" });
    }

    const show = await Show.create(req.body);

    res.status(201).json(show);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId })
      .populate("theatre")
      .populate("screen");

    res.json(shows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};