require("dotenv").config();
const { Sequelize } = require("sequelize");

// Convert port to number
const DB_PORT = parseInt(process.env.DB_PORT, 10);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: console.log, // optional: shows SQL queries
    dialectOptions: {
      ssl: false, // local MySQL does not need SSL
    },
  },
);

// Test connection
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
}

connectDB();

module.exports = sequelize;
