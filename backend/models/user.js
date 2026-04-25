const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define("User", {
  /* BASIC INFO */
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "student"
  },

  /* STUDENT EXTRA INFO */
  school: {
    type: DataTypes.STRING,
    defaultValue: ""
  },

  referral: {
    type: DataTypes.STRING,
    defaultValue: ""
  },

  /* SUBJECTS */
  subjects: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  assignedSubjects: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  /* PAYMENT + SUBSCRIPTION */
  subscription: {
    type: DataTypes.JSON,
    defaultValue: {
      status: "inactive",
      approvedAt: null,
      expiresAt: null,
      amount: 0,
      plan: ""
    }
  },

  /* PROFILE */
  photo: {
    type: DataTypes.TEXT("long"),
    allowNull: true
  },

  bio: {
    type: DataTypes.TEXT,
    defaultValue: ""
  },

  phone: {
    type: DataTypes.STRING,
    defaultValue: ""
  },

  /* ANALYTICS */
  averageScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  totalQuizzes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  attendanceCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  /* STATUS */
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = User;