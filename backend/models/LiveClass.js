const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const LiveClass = sequelize.define("LiveClass", {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
  },
  teacherName: {
    type: DataTypes.STRING,
  },
  roomId: {
    type: DataTypes.STRING,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "offline",
  },
});

module.exports = LiveClass;