
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("groups", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false
        },
        group: {
            type: DataTypes.STRING(45),
            allowNull: true
        },       
        year: {
            type: DataTypes.STRING(45),
            allowNull: true
        },     
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
