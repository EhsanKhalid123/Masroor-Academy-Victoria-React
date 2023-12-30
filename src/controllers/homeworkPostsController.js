
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Import all database files
const db = require("../database");

// Endpoint for selecting all posts from the database.
exports.all = async (req, res) => {
  try {
    // Gets all posts from DB and does Eager Loading to display User information related to the user who made posts.
    const homeworks = await db.homeworkPosts.findAll({
      include: [
        { model: db.users, as: "poster" },
        { model: db.users, as: "user" }
      ]
    });
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
      student: req.body.student,
      class: req.body.class
    });

    res.json(post);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Endpoint for selecting attendance for a specific date
exports.selected = async (req, res) => {
  const classname = req.params.classname;
  const studentID = req.params.studentID;

  try {
    // Query the database using the provided classname and studentID
    const post = await db.homeworkPosts.findOne({
      where: { class: classname, student: studentID },
    });

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
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
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};

// Update the attendance record for a specific date
exports.update = async (req, res) => {
  const classname = req.params.classname;
  const studentID = req.params.studentID;

  const { homework } = req.body;

  try {
    const post = await db.homeworkPosts.findOne({
      where: { class: classname, student: studentID },
    });
    if (post) {
      post.homeworkText = homework.homeworkText;
      post.id = homework.id;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ error: 'Homework Post was not updated' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a specific users posts from the database to avoid foreign Key Constraint Fail.
exports.delete2 = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const post = await db.homeworkPosts.destroy({ where: { id: id } });

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


// Remove a specific users posts from the database to avoid foreign Key Constraint Fail.
exports.deleteByID = async (req, res) => {
  try {
    const classname = req.params.classname;
    const studentID = req.params.studentID;
    let removed = false;

    const post = await db.homeworkPosts.findOne({ where: { student: studentID, class: classname } });
    if (post !== null) {
      console.log(post);
      await post.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};
