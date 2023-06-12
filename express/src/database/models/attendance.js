const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("attendance", {

        // Defining Table Fields/Data with properties.
        date: {
            type: DataTypes.DATE,
            primaryKey: true,
          },
          attendance: {
            type: DataTypes.JSON, // or DataTypes.ARRAY(DataTypes.JSON)
            allowNull: false,
          }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
