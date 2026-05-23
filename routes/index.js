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

const pageStyle = `
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e5e7eb;
    }

    .navbar {
      background: #111827;
      padding: 18px 40px;
      border-bottom: 3px solid #ff9900;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      color: #ff9900;
      font-size: 24px;
      font-weight: bold;
    }

    .container {
      max-width: 950px;
      margin: 40px auto;
      padding: 25px;
    }

    .hero {
      background: linear-gradient(135deg, #111827, #1e293b);
      padding: 30px;
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.35);
      margin-bottom: 30px;
    }

    h1 {
      color: #ff9900;
      margin-top: 0;
    }

    h2 {
      color: #38bdf8;
      margin-top: 30px;
    }

    input, textarea {
      width: 100%;
      padding: 13px;
      margin: 10px 0;
      border-radius: 8px;
      border: 1px solid #334155;
      background: #1e293b;
      color: white;
      font-size: 15px;
      box-sizing: border-box;
    }

    textarea {
      height: 130px;
      resize: vertical;
    }

    button {
      background: #ff9900;
      color: #111827;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: 0.2s;
    }

    button:hover {
      background: #ffaa33;
      transform: translateY(-1px);
    }

    .post-card {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 22px;
      border-radius: 14px;
      margin: 18px 0;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    }

    .post-card h3 {
      color: #ff9900;
      margin-top: 0;
    }

    .post-card p {
      line-height: 1.6;
      color: #d1d5db;
    }

    .actions {
      margin-top: 18px;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .edit-btn {
      background: #38bdf8;
      color: #0f172a;
      padding: 11px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
    }

    .delete-btn {
      background: #ef4444;
      color: white;
    }

    .delete-btn:hover {
      background: #f87171;
    }

    .back-link {
      color: #38bdf8;
      text-decoration: none;
      font-weight: bold;
    }

    .empty {
      background: #1e293b;
      border: 1px dashed #475569;
      padding: 20px;
      border-radius: 12px;
      color: #cbd5e1;
    }
  </style>
`;

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
  db.query("SELECT * FROM posts ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Error loading posts");
    }

    let postsHtml = "";

    if (results.length === 0) {
      postsHtml = `<div class="empty">No posts yet. Create your first blog post above.</div>`;
    }

    results.forEach((post) => {
      postsHtml += `
        <div class="post-card">
          <h3>${post.title}</h3>
          <p>${post.content}</p>

          <div class="actions">
            <a class="edit-btn" href="/edit-post/${post.id}">Edit</a>

            <form action="/delete-post/${post.id}" method="POST">
              <button class="delete-btn" type="submit">Delete</button>
            </form>
          </div>
        </div>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AWS Blog Dashboard</title>
        ${pageStyle}
      </head>
      <body>

        <div class="navbar">
          <div class="logo">AWS Blog App</div>
          <div>Cloud-Based Secure Web Application</div>
        </div>

        <div class="container">

          <div class="hero">
            <h1>Blog Dashboard 🚀</h1>
            <p>Create, view, edit, and delete blog posts using a Node.js, MySQL, and AWS-based application.</p>
          </div>

          <h2>Create New Post</h2>

          <form action="/create-post" method="POST">
            <input type="text" name="title" placeholder="Enter post title" required>
            <textarea name="content" placeholder="Write your blog content here..." required></textarea>
            <button type="submit">Create Post</button>
          </form>

          <hr>

          <h2>All Blog Posts</h2>

          ${postsHtml}

        </div>

      </body>
      </html>
    `);
  });
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

router.post("/create-post", (req, res) => {
  const { title, content } = req.body;

  db.query(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
    [title, content],
    (err) => {
      if (err) {
        console.log("Create post error:", err);
        return res.send("Error creating post");
      }

      res.redirect("/dashboard");
    }
  );
});

router.get("/edit-post/:id", (req, res) => {
  const postId = req.params.id;

  db.query("SELECT * FROM posts WHERE id = ?", [postId], (err, results) => {
    if (err) {
      console.log("Edit load error:", err);
      return res.send("Error loading post");
    }

    if (results.length === 0) {
      return res.send("Post not found");
    }

    const post = results[0];

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Edit Post</title>
        ${pageStyle}
      </head>
      <body>

        <div class="navbar">
          <div class="logo">AWS Blog App</div>
          <div>Edit Blog Post</div>
        </div>

        <div class="container">
          <div class="hero">
            <h1>Edit Post</h1>
            <p>Update your blog post title and content.</p>
          </div>

          <form action="/update-post/${post.id}" method="POST">
            <input type="text" name="title" value="${post.title}" required>
            <textarea name="content" required>${post.content}</textarea>
            <button type="submit">Update Post</button>
          </form>

          <br>
          <a class="back-link" href="/dashboard">← Back to Dashboard</a>
        </div>

      </body>
      </html>
    `);
  });
});

router.post("/update-post/:id", (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  db.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, postId],
    (err) => {
      if (err) {
        console.log("Update error:", err);
        return res.send("Error updating post");
      }

      res.redirect("/dashboard");
    }
  );
});

router.post("/delete-post/:id", (req, res) => {
  const postId = req.params.id;

  db.query("DELETE FROM posts WHERE id = ?", [postId], (err) => {
    if (err) {
      console.log("Delete error:", err);
      return res.send("Error deleting post");
    }

    res.redirect("/dashboard");
  });
});

module.exports = router;