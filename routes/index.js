const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../db");

// Home
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Register page
router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

// Login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

// Register POST
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error saving user");
    } else {
      res.send("User registered successfully ✅");
    }
  });
});

// Login POST
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.log(err);
      res.send("Error during login");
    } else {
      if (results.length > 0) {
        res.send("Login successful 🎉");
      } else {
        res.send("Invalid email or password ❌");
      }
    }
  });
});

module.exports = router;