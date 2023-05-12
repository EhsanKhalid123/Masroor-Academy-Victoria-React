
const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
    // Defining the table name.
    sequelize.define("users", {

        // Defining Table Fields/Data with properties.
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        hashed_password: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        group: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        class: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        studentEmail: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        studentDob: {
            type: DataTypes.DATEONLY(),
            allowNull: true
        },
        jamaat: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        fathersName: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        fathersEmail: {
            type: DataTypes.STRING(40),
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
            type: DataTypes.STRING(40),
            allowNull: true
        },
        mothersContact: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });
