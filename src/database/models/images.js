
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("images", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // Defining Table Fields/Data with properties.
        date: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        image: {
            type: DataTypes.BLOB('long'),
            allowNull: true
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
