
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Import all database files
const db = require("../database");

// Endpoint for selecting all posts from the database.
exports.all = async (req, res) => {
  // Gets all posts from DB and does Eager Loading to display User information related to the user who made posts.
  const homeworks = await db.homeworkPosts.findAll({ include: { model: db.users, as: "user" } });
  res.json(homeworks);
};

// Endpoint for creating a post in the database.
// Routes are delcared in Routes folder.
exports.create = async (req, res) => {
  const post = await db.homeworkPosts.create({
    homeworkText: req.body.homeworkText,
    id: req.body.id
  });

  res.json(post);
};

// Remove/Deletes a post from the database.
exports.delete = async (req, res) => {
  const forumPosts_id = req.body.homeworkPosts_id;

  let removed = false;

  const post = await db.homeworkPosts.findByPk(forumPosts_id);
  if (post !== null) {
    await post.destroy();
    removed = true;
  }

  return res.json(removed);
};

// Remove a specific users posts from the database to avoid foreign Key Constraint Fail.
exports.delete2 = async (req, res) => {
  const email = req.body.email;

  let removed = false;

  // const post = await db.forumPosts.findAll({where: { email: email }});

  // // if(post !== null) {
  //   await post.destroy();
  //   removed = true;
  // }

  const post = await db.homeworkPosts.destroy({ where: { email: email } });


  return res.json(post);
};

