// Old fashioned Import statements for libraries and files
const db = require("../database");
const argon2 = require("argon2");
const { sign } = require('jsonwebtoken');
require('dotenv').config();

// Endpoint for Select all users from the database.
exports.all = async (req, res) => {
  try {
    const users = await db.users.findAll();

    res.json(users);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one user from the database.
exports.one = async (req, res) => {
  try {
    const user = await db.users.findByPk(req.params.id);

    res.json(user);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  try {
    const user = await db.users.findByPk(req.body.id.toUpperCase().trim());

    if (user === null || user.hashed_password !== req.body.password) {
      // Login failed.
      res.json(null);
    } else {
      const accessToken = sign({ id: user.id, name: user.name, hashed_password: user.hashed_password, group: user.group, archived: user.archived, class: user.class, gender: user.gender, jamaat: user.jamaat, studentEmail: user.studentEmail }, process.env.jwtkey, {
        expiresIn: 7200,
      })
      res.json(accessToken);
    }
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Logging In" });
  }
};

// Create a user in the database.
exports.create = async (req, res) => {
  try {
    // const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

    // Following properties are required for user to be created in DB
    const user = await db.users.create({
      id: req.body.id,
      name: req.body.name,
      hashed_password: req.body.hashed_password,
      group: req.body.group,
      gender: req.body.gender,
      class: req.body.class,
      archived: req.body.archived,
      studentEmail: req.body.studentEmail,
      studentDob: req.body.studentDob,
      jamaat: req.body.jamaat,
      fathersName: req.body.fathersName,
      fathersEmail: req.body.fathersEmail,
      fathersContact: req.body.fathersContact,
      mothersName: req.body.mothersName,
      mothersEmail: req.body.mothersEmail,
      mothersContact: req.body.mothersContact,
      
    });

    res.json(user);
  } catch (error) {
    // Send an error response.
    console.log(error)
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update user Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await db.users.findByPk(id);

    user.name = req.body.name;
    user.hashed_password = req.body.hashed_password;
    user.group = req.body.group;
    user.gender = req.body.gender;
    user.class = req.body.class;
    user.archived = req.body.archived;
    user.studentEmail = req.body.studentEmail,
    user.jamaat = req.body.jamaat;
    

    await user.save();

    const accessToken = sign({ id: user.id, name: user.name, hashed_password: user.hashed_password, group: user.group, gender: user.gender, class: user.class, archived: user.archived, studentEmail: user.studentEmail, jamaat: user.jamaat  }, process.env.jwtkey, {
      expiresIn: 7200,
    })

    return res.json(accessToken);
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

    const homeworkGetStudent = await db.homeworkPosts.findAll({ where: { student: id } });
    if (homeworkGetStudent !== null) {
      await db.homeworkPosts.destroy({ where: { student: id } });
      console.log("Deleted all homework Student asscoiated with " + id);
    }

    const homeworkGetPoster = await db.homeworkPosts.findAll({ where: { id: id } });
    if (homeworkGetPoster !== null) {
      await db.homeworkPosts.destroy({ where: { id: id } });
      console.log("Deleted all homework Poster asscoiated with " + id);
    }

    const announcementGet = await db.announcements.findAll({ where: { id: id } });
    if (announcementGet !== null) {
      await db.announcements.destroy({ where: { id: id } });
      console.log("Deleted all Announcements asscoiated with " + id);
    }

    const user = await db.users.findByPk(id);
    if (user !== null) {
      await user.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    console.log(error);
    res.status(500).json({ message: "Error Deleting Data" });
  }
};

