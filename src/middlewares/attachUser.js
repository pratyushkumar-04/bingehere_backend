import User from "../models/users.models.js";

const attachUser = async (req, res, next) => {
  try {
    const userId = req.headers.userid || req.body.userId || req.query.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default attachUser;
