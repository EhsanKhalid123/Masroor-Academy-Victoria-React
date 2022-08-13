
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("replyPosts", {
        // Defining Table Fields/Data with properties.
        replyPosts_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // Defining Posts field in the table with properties of SQL.
        replyText: {
            type: DataTypes.STRING(600),
            allowNull: false
        },
        // Defining Table Fields/Data with properties.
        replyDate: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
