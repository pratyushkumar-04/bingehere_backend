import Screen from "../models/screen.models.js";


export const createScreen = async (req, res) => {
  try {
    const screenData = await Screen.create(req.body);
    res.json(screenData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};