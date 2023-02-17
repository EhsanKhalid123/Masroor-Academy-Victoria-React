
// Import all database files
const db = require("../database");

// Endpoint for selecting all announcements from the database.
exports.all = async (req, res) => {
   
    // Gets all posts from DB and does Eager Loading to display User information related to the user who made posts.
    const announcement = await db.announcements.findAll({ include: { model: db.users, as: "user" } });
    res.json(announcement);
};

// Endpoint for creating a announcement in the database.
// Routes are delcared in Routes folder.
exports.create = async (req, res) => {
    const announcement = await db.announcements.create({
        announcementText: req.body.announcementText,
        id: req.body.id
    });

    res.json(announcement);
};

// Remove an announcement from the database.
exports.delete = async (req, res) => {
    const announcement_id = req.body.announcement_id;

    let removed = false;

    const announcement = await db.announcements.findByPk(announcement_id);
    if (announcement !== null) {
        await announcement.destroy();
        removed = true;
    }

    return res.json(removed);
};

