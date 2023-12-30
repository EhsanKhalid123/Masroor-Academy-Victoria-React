const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
  // Defining the table name.
  sequelize.define("results", {

    // Defining Table Fields/Data with properties.
    resultID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    studentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentGroup: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    markedHomework: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // result: {
    //   type: DataTypes.STRING(45),
    //   allowNull: true
    // },
    result: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const data = this.getDataValue('result');
        return data ? JSON.parse(data) : null;
      },
      set(val) {
        this.setDataValue('result', JSON.stringify(val));
      },
    },
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
