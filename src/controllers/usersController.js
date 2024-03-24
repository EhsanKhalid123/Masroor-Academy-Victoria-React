// Old fashioned Import statements for libraries and files
const db = require("../database");
const argon2 = require("argon2");
const { sign } = require('jsonwebtoken');
require('dotenv').config();

const { Op } = require('sequelize');
const sequelize = db.sequelize;

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

// Select one user from the database.
exports.oneRegister = async (req, res) => {
  try {
    const user = await db.users.findByPk(req.params.id);

    if (!user) {
      res.json(null);
    } else {
      res.json(true);
    }
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one user from the database if email and password are a match.
exports.login = async (req, res) => {
  try {
    const user = await db.users.findByPk(req.body.id.toUpperCase().trim());

    if (user === null || await argon2.verify(user.hashed_password, req.body.password) === false){
      // Login failed.
      res.json(null);
    } else {
      const accessToken = sign({ id: user.id, name: user.name, hashed_password: user.hashed_password, group: user.group, archived: user.archived, class: user.class, gender: user.gender, jamaat: user.jamaat, studentEmail: user.studentEmail, forcePasswordChange: user.forcePasswordChange }, process.env.jwtkey, {
        expiresIn: 7200,
      })
      res.json(accessToken);
    }
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Logging In" });
  }
};

function assignGroup(groups, studentDob) {
  // Get the user's birth year from their date of birth
  const birthYear = new Date(studentDob).getFullYear();
  console.log(birthYear);

  let assignedGroup = null;

  // Find the group that matches the user's birth year
  for (const group of groups) {
    if (group.year) {
      const groupYears = group.year.split("-"); // Split the year range into an array
      console.log(groupYears);

      if (groupYears.length === 1) {
        // Single year case
        const year = parseInt(groupYears[0]);
        console.log(year);
        if (birthYear === year) {
          assignedGroup = group.group;
          break;
        }
      } else if (groupYears.length === 2) {
        // Range case
        const startYear = parseInt(groupYears[0]);
        const endYear = parseInt(groupYears[1]);
        console.log(startYear + " " + endYear);
        if (startYear <= birthYear && birthYear <= endYear) {
          assignedGroup = group.group;
          break;
        }
      }
    }
  }

  return assignedGroup;

};

// Create a user in the database.
exports.create = async (req, res) => {
  try {
    // const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

    let hashedPassword = req.body.hashed_password;
    let group = req.body.group;
    var assignedGroup = null;

    if (group !== "Admin" && group !== "Male Teacher" && group !== "Female Teacher" && group !== "Principal") {
      if (hashedPassword !== "student" || hashedPassword === null) {
        hashedPassword = "student";
      }
    }

    const hashedPassword2 = await argon2.hash(hashedPassword, { type: argon2.argon2id });

    // Fetch groups from the database
    if (group !== "Admin" && group !== "Male Teacher" && group !== "Female Teacher" && group !== "Principal") {
      const groups = await db.groups.findAll();
      assignedGroup = assignGroup(groups, req.body.studentDob);
    } else {
      assignedGroup = req.body.group;
    }

    // Following properties are required for user to be created in DB
    const user = await db.users.create({
      id: req.body.id,
      name: req.body.name,
      hashed_password: hashedPassword2,
      group: assignedGroup,
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
      forcePasswordChange: req.body.forcePasswordChange
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update user Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await db.users.findByPk(id);

    const nonHashedPassword = req.body.hashed_password;
    const hashedPassword = await argon2.hash(nonHashedPassword, { type: argon2.argon2id });

    user.name = req.body.name;
    user.hashed_password = hashedPassword;
    user.group = req.body.group;
    user.gender = req.body.gender;
    user.class = req.body.class;
    user.archived = req.body.archived;
    user.studentEmail = req.body.studentEmail;
    user.jamaat = req.body.jamaat;
    user.fathersEmail = req.body.fathersEmail;
    user.fathersContact = req.body.fathersContact;
    user.mothersName = req.body.mothersName;
    user.mothersEmail = req.body.mothersEmail;
    user.mothersContact = req.body.mothersContact;
    user.forcePasswordChange = req.body.forcePasswordChange


    await user.save();

    const accessToken = sign({ id: user.id, name: user.name, hashed_password: user.hashed_password, group: user.group, gender: user.gender, class: user.class, archived: user.archived, studentEmail: user.studentEmail, jamaat: user.jamaat, forcePasswordChange: user.forcePasswordChange }, process.env.jwtkey, {
      expiresIn: 7200,
    })

    return res.json(accessToken);
  } catch (error) {
    console.log(error);
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
    res.status(500).json({ message: "Error Deleting Data" });
  }
};

// check if a user with same name and parent name already exists.
exports.check = async (req, res) => {
  try {
    const studentName = req.body.name.toLowerCase();
    const fathersName = req.body.fathersName.toLowerCase();

    const getUser = await db.users.findOne({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), studentName),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('fathersName')), fathersName)
        ]
      }
    });

    if (getUser !== null) {
      return res.json(getUser);
    } else {
      return res.json(null);
    }

  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Fetching Data" });
  }
};

