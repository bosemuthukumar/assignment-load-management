const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // IMPORTANT: allows Railway SSL
      },
    },

    logging: false,
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
