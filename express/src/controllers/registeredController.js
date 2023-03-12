
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

// Old fashioned Import statements for libraries and files
const db = require("../database");
const argon2 = require("argon2");
const Sequelize = require("sequelize");

// Endpoint for Select all users from the database.
exports.all = async (req, res) => {
  try {
    const registered = await db.registereds.findAll();

    res.json(registered);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one user from the database.
exports.one = async (req, res) => {
  try {
    const registered = await db.registereds.findByPk(req.params.email);

    res.json(registered);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one user from the database.
exports.one2 = async (req, res) => {
  try {
    const registered = await db.registereds.findByPk(req.params.id);

    res.json(registered);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};


// Create a user in the database.
exports.create = async (req, res) => {
  try {
    // const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

    // Following properties are required for user to be created in DB
    const registered = await db.registereds.create({
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      auxiliary: req.body.auxiliary,
      jamaat: req.body.jamaat,
      pname: req.body.pname,
      pemail: req.body.pemail,
      contact: req.body.contact
    });

    res.json(registered);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update user Details in the database.
exports.update = async (req, res) => {
  try {
    const name = req.params.name;

    const user = await db.users.findByPk(name);

    user.name = req.body.name;

    await user.save();

    return res.json(user);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Updating Data" });
  }
};

// Remove a user from the database.
exports.delete = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const user = await db.users.findByPk(id);
    if (user !== null) {
      await user.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};

