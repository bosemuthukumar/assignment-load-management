const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // IMPORTANT: allows Railway SSL
    },
  },

  logging: false,
});

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
