const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const CardModel = require("./models/Card")

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/user", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Registration Route
app.post("/register", async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create(req.body);
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Email and password are required");
  }

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json("No record existed");
      }

      if (user.password === password) {
        res.json("Success");
      } else {
        res.status(400).json("The password is incorrect");
      }
    })
    .catch((err) => res.status(500).json("Server error"));
});

// Route to create a new card
app.post('/cards', async (req, res) => {
  try {
    const { title } = req.body;

    // Validate request body
    if (!title) {
      return res.status(400).json({ error: "The 'title' field is required." });
    }

    // Create and save new card
    const newCard = new CardModel({ title });
    await newCard.save();

    // Send created card as response
    res.status(201).json(newCard);
  } catch (err) {
    console.error("Error creating card:", err.message);
    res.status(500).json({ error: "Failed to create card. Please try again later." });
  }
});

// Route to get all cards
app.get('/cards', async (req, res) => {
  try {
    // Fetch all cards
    const cards = await CardModel.find();

    // Send cards as response
    res.status(200).json(cards);
  } catch (err) {
    console.error("Error fetching cards:", err.message);
    res.status(500).json({ error: "Failed to fetch cards. Please try again later." });
  }
});




app.listen(3001, () => {
  console.log("Server is running");
});

module.exports = app;