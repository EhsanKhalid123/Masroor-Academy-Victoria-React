
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// ORM Related Code Goes in This File.

// Import Sequelize Library and its Components.
const { Sequelize, DataTypes } = require("sequelize");
// Import Database information from config file so it can connect to the DB.
const config = require("./config.js");

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
db.registereds = require("./models/registered.js")(db.sequelize, DataTypes);
db.users = require("./models/users.js")(db.sequelize, DataTypes);
db.homeworkPosts = require("./models/homeworkPosts.js")(db.sequelize, DataTypes);
db.announcements = require("./models/announcements.js")(db.sequelize, DataTypes);
db.formStatus = require("./models/formStatus.js")(db.sequelize, DataTypes);
db.images = require("./models/images.js")(db.sequelize, DataTypes);
db.resources = require("./models/resources.js")(db.sequelize, DataTypes);

// Relate homework posts and user through foreign key.
// Relating homework table to the Users table with a foreign key.
db.homeworkPosts.belongsTo(db.users, { foreignKey: { name: "id", allowNull: false, onDelete: 'CASCADE', hooks: true }, as: "poster" });
// Relating announcement Posts table to the users table with a foreign key.
db.announcements.belongsTo(db.users, { foreignKey: { name: "id", allowNull: false, onDelete: 'CASCADE', hooks: true } });
// Relating homework Posts table to the Users table with a foreign key.
db.homeworkPosts.belongsTo(db.users, { foreignKey: { name: "student", allowNull: false, onDelete: 'CASCADE', hooks: true }, as: "user"});

// Include a sync option with seed data logic included.
db.sync = async () => {
    // Sync schema.
    // Creates the tables defined in Models if not created
    // await db.sequelize.sync();
    await db.sequelize.sync({force: true});

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
    await db.users.create({ id: "M-B-001", name: "Jazib Khalid", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-002", name: "Ainan Ali Massan", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-003", name: "Abdul Shafi Ahmad", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-004", name: "Mohid Ahmad Sethi", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-005", name: "Mudabir Khan Abro", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-062", name: "Farus Khalid", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-063", name: "Shawaiz Ikram", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-079", name: "Rabee Ahmad", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-82", name: "Nasseah Yousaf Syed", hashed_password: "student", group: "14-15 (Group 4)", gender: "Atfal", archived: false });

    await db.users.create({ id: "M-B-006", name: "Taha Zahid", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-007", name: "Sher Ali Nasir Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-008", name: "Mohammed Abdul Haq Tabish", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-009", name: "Faris Ahmed", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-010", name: "Muzamil Khan Abro", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-011", name: "Sammar Usman", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-012", name: "Azan Ali Massan", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-013", name: "Abdullah Bin Shahid", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-014", name: "Mirza Ibrahim Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-015", name: "Mohammad Hami Kaleem", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-016", name: "Aaryan Abid", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-017", name: "Atyab Danial Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-018", name: "Aaban Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-057", name: "Basim Tanoli", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-064", name: "Ayyan Kasi", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-065", name: "Ata ul Wahab", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-066", name: "Arham Abdullah", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-067", name: "Tafheem Ahmad Hazari", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-080", name: "Danial Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-081", name: "Rayyan Tariq", hashed_password: "student", group: "12-13 (Group 3)", gender: "Atfal", archived: false });

    await db.users.create({ id: "M-B-019", name: "Ahmed Mukhtar", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-020", name: "Salman Butt", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-021", name: "Ch. Fouzan Ahmad Zahid", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-022", name: "Luqman Mehmood", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-023", name: "Shayan Ahmed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-024", name: "Kashif Mueen", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-025", name: "Aman Ali Massan", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-026", name: "Zain Zahid", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-027", name: "Ahsan Mohsin Saleem", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-028", name: "Hamza Bhatti", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-029", name: "Faran Ahmed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-030", name: "Afeef Kamran Ahad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-031", name: "Kamran Rafe", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-032", name: "Rohaan Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-033", name: "Arham Malik", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-034", name: "Mubariz Ahmad Ghumman", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-035", name: "Azlan Amir Imran", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-036", name: "Salman Ikram", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-037", name: "Abraham Qureshi", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-038", name: "Iftekhar Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-039", name: "Masroor Ahmed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-040", name: "Ilhan Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-041", name: "Armaghan Abid", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-058", name: "Abdul Wahaab", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-059", name: "Rayaan Razi", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-068", name: "Shahryar Ahmad Bhatti", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-069", name: "Hayyan Hafeez", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-070", name: "Adeel Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-071", name: "Azlan Amir Imran", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-083", name: "Waleed Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-084", name: "Abdul Wahab Mirza", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-085", name: "Syed Esah Shahid Jafery", hashed_password: "student", group: "9-11 (Group 2)", gender: "Atfal", archived: false });

    await db.users.create({ id: "M-ME-042", name: "Mohammed Haris Kaleem", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-043", name: "Hannan Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-044", name: "Aarham Rehman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-045", name: "Adil Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-046", name: "Ayan Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-047", name: "Mubeen Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-048", name: "Danish Butt", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-049", name: "Shamaaz Ahmad Ghumman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-050", name: "Waleed Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-051", name: "Arslan Tahir", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-052", name: "Kashif Nadeem Chohan", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-053", name: "Sarim Usman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-054", name: "Ayan Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-055", name: "Usain Shahzeb", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-056", name: "Meer Muhammad Anees", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-061", name: "Zafarullah Arib Bharwana", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-073", name: "Ayaan Ahmed Laiq", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-074", name: "Ashir Salam Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-075", name: "Areeb Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-076", name: "Ghalib Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-L-077", name: "Emad Ahmad Saqib", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-078", name: "Absaar Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-ME-072", name: "Athar Salam Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-086", name: "Nayel Tariq", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-B-087", name: "Wajahat Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-MW-088", name: "Aarkaan Bashir", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });
    await db.users.create({ id: "M-C-089", name: "Tamseel Ahmad Ghumman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });

    // Age Unknown For This Student so added them to 7-8
    await db.users.create({ id: "M-B-060", name: "Asaad S Khan", hashed_password: "student", group: "7-8 (Group 1)", gender: "Atfal", archived: false });



    await db.users.create({ id: "F-B-001", name: "Laraib Baseer", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-002", name: "Maleeha Saeed", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-003", name: "Aroob Ahmad", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-004", name: "Amtul Noor Sabooh Mohammed", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-005", name: "Eshal Sheraz Tanoli", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-006", name: "Madiha Rafe", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-007", name: "Tamseela Imran", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-008", name: "Fatima Usman", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-MW-009", name: "Hadia Mirza", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-065", name: "Kashifah Fayyaz", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-066", name: "Yashfa Fayyaz", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-067", name: "Syeda Tashifa Kashif", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-068", name: "Jazibah Ahmad", hashed_password: "student", group: "14-15 (Group 4)", gender: "Nasirat", archived: false });

    await db.users.create({ id: "F-B-010", name: "Nadia Ahmad", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-011", name: "Aania Rehman", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-012", name: "Maisha Waseem", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-013", name: "Noor Ul Huda", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-014", name: "Ammara Hameed", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-MW-015", name: "Labeeqa Ikram", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-016", name: "Kashifa Ansari", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-017", name: "Hiba Saeed", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-MW-018", name: "Tehseen Imran", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-019", name: "Mahida Khalid", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-MW-052", name: "Leeza Mudassar", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-053", name: "Satwat Hamdah", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-054", name: "Aiza Bajwa", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-055", name: "Saleha", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-069", name: "Saniyah Mirza", hashed_password: "student", group: "12-13 (Group 3)", gender: "Nasirat", archived: false });


    await db.users.create({ id: "F-B-020", name: "Umaiza Ahmed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-021", name: "Kurratulain Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-022", name: "Amtul Farhat Kafi Mohammed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-023", name: "Ghania Yasmeen Shahid", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-024", name: "Aimen Tahir", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-025", name: "Sabeeka Hameed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-026", name: "Rimsha Qamar", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-027", name: "Amtul Sabuh", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-028", name: "Aayat Ameen Anees", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-029", name: "Sara Atif", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-030", name: "Aaleen Rehman", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-031", name: "Tahseen Ansari", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-032", name: "Madiha Adil", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-033", name: "Alina Adil", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-034", name: "Aroush Sheraz Tanoli", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-035", name: "Aiza Shehzad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-036", name: "Azka Butt", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-037", name: "Areesha Basit", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-056", name: "Ashtalfa Aroush", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-057", name: "Sadia Wadood", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-058", name: "Alishba Waseem", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-059", name: "Eshaal Laiq", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-060", name: "Salmana Sameen Saqib", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-061", name: "Jaziba Ahmed", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-070", name: "Madiha Urooj Ahmad", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-071", name: "Syeda Fabiha Kashif", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-072", name: "Ayezah K Kahlon", hashed_password: "student", group: "9-11 (Group 2)", gender: "Nasirat", archived: false });

    await db.users.create({ id: "F-L-038", name: "Munazzah Noor", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-039", name: "Raazia Fiaz", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-040", name: "Rijja Iman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-041", name: "Anaya Mehmood", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-MW-042", name: "Jaazba Taslim Hazari", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-043", name: "Aira Ahad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-044", name: "Aabish Abeel Anees", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-045", name: "Muneefa Fatima Zeeshan", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-046", name: "Rubaisha Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-047", name: "Abrish Basit", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-048", name: "Noor Jahan Nusrat Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-049", name: "Sabeeka Ahmed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-050", name: "Sarah Noman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-051", name: "Zoya Asim", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-062 ", name: "Nida Hameed", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-063", name: "Aira Saqib", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-064", name: "Zainish Luqman", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-C-073", name: "Abeeha Sohail", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-074", name: "Anaya Zohaib Mahmood", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-075", name: "Roohi Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-ME-076", name: "Noor Jahan Nusrat Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-077", name: "Eiza Rajput", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-L-078", name: "Abraj Shahzeb", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });
    await db.users.create({ id: "F-B-080", name: "Rabiyya Ahmad", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });

    // Age Unknown For This Student so added them to 7-8
    await db.users.create({ id: "F-C-079", name: "Adawiyah Parisa", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat", archived: false });

    // await db.users.create({ id: "", name: "", hashed_password: "student", group: "7-8 (Group 1)", gender: "Nasirat",  class: "", archived: false });

    await db.users.create({ id: "MT-001", name: "Farhan Khalid", hashed_password: "mateacherboard", group: "Male Teacher", gender: "Male", class: "Holy Quran", archived: false });
    await db.users.create({ id: "FT-001", name: "Nida Mukhtar", hashed_password: "mateacherboard", group: "Female Teacher", gender: "Female", class: "Holy Quran", archived: false });

    // await db.users.create({ id: "FemaleTeachers", name: "Teacher", hashed_password: "mateacherboard", group: "none", gender: "Female" });
    // await db.users.create({ id: "MaleTeachers", name: "Teacher", hashed_password: "mateacherboard", group: "none", gender: "Male" });
    await db.users.create({ id: "Admin", name: "Admin", hashed_password: "maadminboard", group: "Admin", gender: "Admin", archived: false });
    // await db.homeworkPosts.create({ homeworkPosts_id: "0", homeworkText: "0", id: "Admin" });

    await db.formStatus.create();
    await db.formStatus.create({id: "regFormMessage", status: null, text: "Please fill in the form below in order to enroll for Masroor Academy. By filling in this form you accept all the rules and guidelines."});


}

// Exporting db module methods so it can be accessed by other classes/files.
module.exports = db;