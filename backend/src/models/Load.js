// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const Load = sequelize.define(
//   "Load",
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING(150),
//       allowNull: false,
//       trim: true,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     pickupLocation: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//       trim: true,
//     },
//     dropLocation: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//       trim: true,
//     },
//     weight: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM("Pending", "Booked", "Completed"),
//       defaultValue: "Completed",
//     },
//     distance: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     duration: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//     createdBy: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//       references: {
//         model: "User",
//         key: "id",
//       },
//     },
//   },
//   {
//     tableName: "Load",
//   },
// );

// module.exports = Load;


const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Load = sequelize.define(
  "Load",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    pickupLocation: { type: DataTypes.STRING(200), allowNull: false },
    dropLocation: { type: DataTypes.STRING(200), allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("Pending", "Booked", "Completed"),
      defaultValue: "Pending",
    },
    distance: { type: DataTypes.FLOAT },
    duration: { type: DataTypes.STRING(100) },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED, // <- must match User.id
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "Load", // exact table name
  }
);

module.exports = Load;