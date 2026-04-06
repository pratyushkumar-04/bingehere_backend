// import "dotenv/config";
// import express from "express";
// import connectDB from "./db.js";
// import User from "./models/users.models.js";
// import cors from "cors";
// import bcrypt from "bcrypt";
// const app = express();

// app.use(express.json());

// // connect DB
// connectDB();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

// // SIGNUP
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error creating user" });
//   }
// });

// // --- LOGIN ENDPOINT ---
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // 2. Compare password with hashed password in DB
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // 3. Success (You would typically issue a JWT token here)
//     res.status(200).json({
//       message: "Login successful",
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });
// // -------

// // GET USERS (optional check)
// app.get("/users", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

// app.listen(3000, () => console.log("Server running on port 3000"));

import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";

// routes
import routes from "./routes/index.js";

const app = express();

// middlewares
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB connect
connectDB();

// use routes
app.use("/api", routes);

// test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);