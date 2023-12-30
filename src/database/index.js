
// ORM Related Code Goes in This File.

// Import Sequelize Library and its Components.
const { Sequelize, DataTypes } = require("sequelize");
// Import Database information from config file so it can connect to the DB.
const config = require("./config.js");

require('dotenv').config();

// Constant DB to store methods inside and allow the outside world to use them by calling db.methodName.
const db = {
    Op: Sequelize.Op
};

// Create Sequelize.
// Tell the ORM about the database, so it can connect.
// Created an Instance of Sequelize and passed the database information from config.js file.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT
});

// Define Models.
// Importing database tables/models to create and use.
db.users = require("./models/users.js")(db.sequelize, DataTypes);
db.homeworkPosts = require("./models/homeworkPosts.js")(db.sequelize, DataTypes);
db.announcements = require("./models/announcements.js")(db.sequelize, DataTypes);
db.formStatus = require("./models/formStatus.js")(db.sequelize, DataTypes);
db.images = require("./models/images.js")(db.sequelize, DataTypes);
db.resources = require("./models/resources.js")(db.sequelize, DataTypes);
db.groups = require("./models/groups.js")(db.sequelize, DataTypes);
db.classes = require("./models/classes.js")(db.sequelize, DataTypes);
db.syllabus = require("./models/syllabus.js")(db.sequelize, DataTypes);
db.attendance = require("./models/attendance.js")(db.sequelize, DataTypes);
db.homework = require("./models/homework.js")(db.sequelize, DataTypes);
db.results = require("./models/results.js")(db.sequelize, DataTypes);
db.finalResults = require("./models/finalResults.js")(db.sequelize, DataTypes);

// Relate homework posts and user through foreign key.
// Relating homework table to the Users table with a foreign key.
db.homeworkPosts.belongsTo(db.users, { foreignKey: { name: "id", allowNull: false, onDelete: 'CASCADE', hooks: true }, as: "poster" });
// Relating announcement Posts table to the users table with a foreign key.
db.announcements.belongsTo(db.users, { foreignKey: { name: "id", allowNull: false, onDelete: 'CASCADE', hooks: true } });
// Relating homework Posts table to the Users table with a foreign key.
db.homeworkPosts.belongsTo(db.users, { foreignKey: { name: "student", allowNull: false, onDelete: 'CASCADE', hooks: true }, as: "user"});
// Relating groups to syllabus
db.syllabus.belongsTo(db.groups, {foreignKey: {name: "groupId", allowNull: false, onDelete: 'CASCADE', hooks: true}});

// Include a sync option with seed data logic included.
db.sync = async () => {
    // Sync schema.
    // Creates the tables defined in Models if not created
    await db.sequelize.sync();
    // await db.sequelize.sync({force: true});

    // Runs this function asyncornous to the above one, so this only runs once above one is completed.
    await addData();
};

// Function to add Data in to DB if not already added.
async function addData() {
    // Variable Constant Declared = Counts the users tables data.
    const userCount = await db.users.count();

    // Only seed data if necessary.
    // Checks if there are no users in the database users table and then runs the bottom code otherwise this function is returned if data already exists in users table in DB.
    if (userCount > 0)
        return;

    // Creates and argon2 instance for password hashing.
    // argon2 is a library for hashing.
    const argon2 = require("argon2");

    // Sample User data to add into the database user table.
    // let hashedPassword = await argon2.hash("abc123", { type: argon2.argon2id });

    await db.users.create({ id: "Admin", name: "SysAdmin", hashed_password: process.env.ADMINPASS, group: "Admin", gender: "Admin", archived: false });
    // await db.homeworkPosts.create({ homeworkPosts_id: "0", homeworkText: "0", id: "Admin" });

    await db.formStatus.create(); // Creates the Default Form Status from Model
    await db.formStatus.create({id: "regFormMessage", status: null, text: "Please fill in the form below in order to enroll for Masroor Academy. By filling in this form you accept all the rules and guidelines."});

    await db.groups.create({id: "Admin", group: "Admin"});
    await db.groups.create({id: "Male Teacher", group: "Male Teacher"});
    await db.groups.create({id: "Female Teacher", group: "Female Teacher"});
    await db.groups.create({id: "Principal", group: "Principal"});

}

// Exporting db module methods so it can be accessed by other classes/files.
module.exports = db;