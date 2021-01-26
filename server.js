const express = require("express");
const app = express();
const todoRoutes = require("./routes/todoRoutes");
const connectDB = require("./config/db");
app.use(express.json());

app.use("/todos", todoRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

connectDB();

module.exports = app;
