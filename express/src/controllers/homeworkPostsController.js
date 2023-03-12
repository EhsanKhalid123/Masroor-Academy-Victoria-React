
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Import all database files
const db = require("../database");

// Endpoint for selecting all posts from the database.
exports.all = async (req, res) => {
  try {
    // Gets all posts from DB and does Eager Loading to display User information related to the user who made posts.
    const homeworks = await db.homeworkPosts.findAll({ include: { model: db.users, as: "user" } });
    res.json(homeworks);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Endpoint for creating a post in the database.
// Routes are delcared in Routes folder.
exports.create = async (req, res) => {
  try {
    const post = await db.homeworkPosts.create({
      homeworkText: req.body.homeworkText,
      id: req.body.id,
      student: req.body.student
    });

    res.json(post);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Remove/Deletes a post from the database.
exports.delete = async (req, res) => {
  try {
    const homeworkPosts_id = req.body.homeworkPosts_id;

    let removed = false;

    const post = await db.homeworkPosts.findByPk(homeworkPosts_id);
    if (post !== null) {
      await post.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};

// Remove a specific users posts from the database to avoid foreign Key Constraint Fail.
exports.delete2 = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    // const post2 = await db.homeworkPosts.findAll({ where: { id: id } });

    // if(post2 !== null) {
    //   await post2.destroy();
    //   removed = true;
    // }

    const post = await db.homeworkPosts.destroy({ where: { id: id } });

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


