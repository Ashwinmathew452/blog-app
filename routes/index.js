const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "blog_app"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../register.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../dashboard.html"));
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name || "", email, password],
    (err) => {
      if (err) {
        console.log("Register error:", err);
        return res.send("Register error");
      }

      res.redirect("/login");
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.log("Login error:", err);
        return res.send("Login error");
      }

      if (results.length > 0) {
        res.redirect("/dashboard");
      } else {
        res.send("Invalid email or password");
      }
    }
  );
});

module.exports = router;