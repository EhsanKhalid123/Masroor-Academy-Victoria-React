
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("registereds", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        dob: {
            type: DataTypes.DATEONLY(),
            allowNull: false
        },
        auxiliary: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        jamaat: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        pname: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        pemail: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
