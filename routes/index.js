const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name || "", email, hashedPassword],
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
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log("Login error:", err);
        return res.send("Login error");
      }

      if (results.length === 0) {
        return res.send("Invalid email or password");
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.redirect("/dashboard");
      } else {
        res.send("Invalid email or password");
      }
    }
  );
});

module.exports = router;