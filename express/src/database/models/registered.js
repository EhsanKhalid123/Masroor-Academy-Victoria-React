
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
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        dob: {
            type: DataTypes.DATEONLY(),
            allowNull: true
        },
        auxiliary: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        jamaat: {
            type: DataTypes.STRING(15),
            allowNull: true
        },
        fathersName: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        fathersEmail: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        fathersContact: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        mothersName: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        mothersEmail: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        mothersContact: {
            type: DataTypes.STRING(10),
            allowNull: true
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
