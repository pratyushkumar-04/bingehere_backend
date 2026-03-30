import "dotenv/config";
import express from "express"
import connectDB from "./db.js"
import User from "./models/users.models.js"
const app = express();

app.use(express.json());

// connect DB
connectDB();

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      phone,
      password
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

// GET USERS (optional check)
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => console.log("Server running on port 3000"));