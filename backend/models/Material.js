const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Material = sequelize.define("Material", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Reading Material"
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },

  link: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  teacher: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Material;