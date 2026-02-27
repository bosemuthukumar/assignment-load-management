require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("../backend/src/routes/authRoutes");
const loadRoutes = require("../backend/src/routes/loadRoutes");
const locationRoutes = require("../backend/src/routes/locationRoutes");

const app = express();

// =======================
// CORS CONFIGURATION
// =======================
app.use(
  cors({
    origin: [
      "https://assignment-load-management-in38.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// =======================
// BODY PARSER
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/load", loadRoutes);
app.use("/api/location", locationRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Load Management API" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Export for Vercel
module.exports = app;
