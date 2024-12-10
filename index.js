const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/user", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Registration Route
app.post("/register", (req, res) => {
  UserModel.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
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

app.listen(3001, () => {
  console.log("Server is running");
});
