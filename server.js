const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRoutes = require("./routes/index");

app.use("/", indexRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});