const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(cors());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later."
});

app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require("./routes/index");

app.use("/", routes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});