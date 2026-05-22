const express = require("express");
const app = express();

const indexRoutes = require("./routes/index");

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));