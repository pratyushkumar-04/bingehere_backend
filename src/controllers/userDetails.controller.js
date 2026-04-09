import Show from "../models/show.models.js";

// PUBLIC
export const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId)
      .populate("theatre")
      .populate("screen");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
