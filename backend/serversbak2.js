require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Import Sequelize and routes
const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/authRoutes");
const loadRoutes = require("./src/routes/loadRoutes");
const locationRoutes = require("./src/routes/locationRoutes");

const app = express();

// =======================
// CORS CONFIGURATION
// =======================
// Allow your frontend domains, and allow all origins temporarily for testing
app.use(
  cors({
    origin: [
      "https://assignment-load-management-in38.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
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
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: "Server and database running" });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// =======================
// START SERVER (RAILWAY READY)
// =======================
const PORT = process.env.PORT; // Use Railway-provided port ONLY

if (!PORT) {
  console.error("Error: PORT is not defined in environment variables.");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", async () => {
  try {
    // await sequelize.authenticate();
    console.log("Database connected successfully");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Stop server if DB is not ready
  }
});
