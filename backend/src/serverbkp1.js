require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("../models"); // adjust path if needed
const authRoutes = require("../routes/authRoutes");
const loadRoutes = require("../routes/loadRoutes");
const locationRoutes = require("../routes/locationRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: "https://assignment-load-management-in38.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/load", loadRoutes);
app.use("/api/location", locationRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Load Management API" });
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      message: "Server and database running",
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// IMPORTANT: Export app for Vercel
module.exports = app;