
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("users", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        hashed_password: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        group: {
            type: DataTypes.STRING(32),
            allowNull: false
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
