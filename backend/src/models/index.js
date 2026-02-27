// const sequelize = require("../config/database");
// const User = require("./User");
// const Load = require("./Load");

// // Associations
// User.hasMany(Load, {
//   foreignKey: "createdBy",
//   as: "loads",
// });

// Load.belongsTo(User, {
//   foreignKey: "createdBy",
//   as: "creator",
// });

// module.exports = {
//   sequelize,
//   User,
//   Load,
// };
const sequelize = require("../config/database");
const User = require("./User");
const Load = require("./Load");

User.hasMany(Load, { foreignKey: "createdBy", as: "loads" });
Load.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

module.exports = { sequelize, User, Load };