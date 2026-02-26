require("dotenv").config();

const express = require("express");
const cors = require("cors");

// FIXED PATHS (now server.js is in root)
const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/authRoutes");
const loadRoutes = require("./src/routes/loadRoutes");
const locationRoutes = require("./src/routes/locationRoutes");

const app = express();


// CORS
app.use(
  cors({
    origin: ["https://assignment-load-management-in38.vercel.app", "http://localhost:3000"],
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


// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Load Management API",
  });
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


// IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 8080;

console.log(`Starting server on port ${PORT}...`);
app.listen(PORT, "0.0.0.0", async () => {

  try {

    await sequelize.authenticate();

    console.log("Database connected");

  } catch (error) {

    console.error("Database connection failed:", error.message);

  }

  console.log(`Server running on port ${PORT}`);

});