
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("formStatus", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.STRING(15),
            defaultValue: "formStatus",
            primaryKey: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        text: {
            type: DataTypes.TEXT,
            defaultValue: "This form is no longer accepting responses",
            allowNull: true
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
