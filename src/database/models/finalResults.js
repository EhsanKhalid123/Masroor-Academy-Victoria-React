const { Sequelize } = require("sequelize");

// Creating a Sequelize instance and Table.
module.exports = (sequelize, DataTypes) =>
  // Defining the table name.
  sequelize.define("finalResults", {

    // Defining Table Fields/Data with properties.
    studentID: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    studentGroup: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    studentGender: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    fathersName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    mothersName: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    parentEmail: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    studentEmail: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    // subjectResult: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    // },
    subjectResult: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const data = this.getDataValue('subjectResult');
        return data ? JSON.parse(data) : null;
      },
      set(val) {
        this.setDataValue('subjectResult', JSON.stringify(val));
      },
    },
    finalResult: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    attendanceResult: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
