
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("syllabus", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        syllabusContent: {
            type: DataTypes.TEXT,
            allowNull: true
        },       
   
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
