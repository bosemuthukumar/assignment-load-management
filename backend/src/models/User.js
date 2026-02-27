// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
// const bcrypt = require("bcryptjs");

// const User = sequelize.define(
//   "User",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       trim: true,
//     },
//     email: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       unique: true,
//       lowercase: true,
//       validate: {
//         isEmail: true,
//       },
//     },
//     password: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.ENUM("user", "admin"),
//       defaultValue: "user",
//     },
//   },
//   {
//     hooks: {
//       beforeCreate: async (user) => {
//         if (user.password) {
//           user.password = await bcrypt.hash(user.password, 10);
//         }
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed("password")) {
//           user.password = await bcrypt.hash(user.password, 10);
//         }
//       },
//     },
//   },
// );

// // Method to compare password
// User.prototype.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = User;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // <- must be UNSIGNED
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    tableName: "User", // <- exact table name
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
