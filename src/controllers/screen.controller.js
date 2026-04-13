import Screen from "../models/screen.models.js";
import Theatre from "../models/theatre.models.js";

export const createScreen = async (req, res) => {
  try {
    const { theatre } = req.body;

    if (!theatre) {
      return res.status(400).json({ message: "Theatre id is required" });
    }

    const theatreData = await Theatre.findById(theatre);

    if (!theatreData) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    const screenData = await Screen.create(req.body);

    theatreData.screens.push(screenData._id);
    await theatreData.save();

    res.json(screenData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
