
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("announcements", {
        // Defining Table Fields/Data with properties.
        announcement_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        announcementText: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
