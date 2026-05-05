const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const AppSetting = sequelize.define("AppSetting", {
  siteStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Live"
  },
  defaultCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "UGX"
  },
  supportEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "support@maximumscholars.com"
  },
  defaultPaymentPlan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "A"
  },
  autoApprovePayments: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  announcements: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ""
  }
});

module.exports = AppSetting;
