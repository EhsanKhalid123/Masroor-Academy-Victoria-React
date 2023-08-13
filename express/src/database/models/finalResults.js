const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
  // Defining the table name.
  sequelize.define("finalResults", {

    // Defining Table Fields/Data with properties.
    studentID: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    fathersName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    mothersName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    parentEmail: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    studentEmail: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    subjectResult: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    finalResult: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    attendanceResult: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
