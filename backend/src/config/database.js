const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
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
