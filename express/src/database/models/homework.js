const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
  // Defining the table name.
  sequelize.define("homework", {

    // Defining Table Fields/Data with properties.
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    homework: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    classname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    group: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
