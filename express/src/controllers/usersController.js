
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Old fashioned Import statements for libraries and files
const db = require("../database");
const argon2 = require("argon2");
const Sequelize = require("sequelize");

// Endpoint for Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.users.findAll();

  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.users.findByPk(req.params.email);

  res.json(user);
};

// Select one user from the database.
exports.one2 = async (req, res) => {
  const user = await db.users.findByPk(req.params.name);

  res.json(user);
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  const user = await db.users.findByPk(req.query.name);

  if (user === null || user.hashed_password !== req.query.password)
    // Login failed.
    res.json(null);
  else
    res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
  // const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  // Following properties are required for user to be created in DB
  const user = await db.users.create({
    email: req.body.email,
    // username: req.body.username,
    hashed_password: req.body.password,
    name: req.body.name
  });

  res.json(user);
};

// Update user Details in the database.
exports.update = async (req, res) => {
  const name = req.params.name;

  const user = await db.users.findByPk(name);

  user.name = req.body.name;

  await user.save();

  return res.json(user);
};

// Remove a user from the database.
exports.delete = async (req, res) => {
  const email = req.body.email;

  let removed = false;

  const user = await db.users.findByPk(email);
  if (user !== null) {
    await user.destroy();
    removed = true;
  }

  return res.json(removed);
};

