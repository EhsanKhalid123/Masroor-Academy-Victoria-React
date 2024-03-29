
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("homeworkPosts", {
        // Defining Table Fields/Data with properties.
        homeworkPosts_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // Defining Posts field in the table with properties of SQL.
        homeworkText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // Defining Table Fields/Data with properties.
        homeworkDate: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        class: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
