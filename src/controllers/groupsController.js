// Old fashioned Import statements for libraries and files
const db = require("../database");
const { Op } = require('sequelize');

// Endpoint for Select all groups from the database.
exports.all = async (req, res) => {
  try {
    const group = await db.groups.findAll();

    res.json(group);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one group from the database.
exports.one = async (req, res) => {
  try {
    const group = await db.groups.findByPk(req.params.id);

    res.json(group);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Create a group in the database.
exports.create = async (req, res) => {
  try {

    // Following properties are required for group to be created in DB
    const group = await db.groups.create({
      id: req.body.id,
      group: req.body.group,
      year: req.body.year
    });

    res.json(group);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
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
    } else {
      console.log("Error: group.year is null or undefined");
    }
  }
  console.log(assignedGroup);
  return assignedGroup;

};


// Update group Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const vargroup = await db.groups.findByPk(id);

    const oldGroup = vargroup.group; // Store the old group name for comparison
    const oldYear = vargroup.year; // Store the old year for comparison

    vargroup.group = req.body.group;
    vargroup.year = req.body.year;

    await vargroup.save();

    // Update associated users' group information
    if (oldGroup !== req.body.group) {
      const users = await db.users.findAll({ where: { group: oldGroup } });

      for (const user of users) {
        user.group = req.body.group;
        await user.save();
      }
    }
    console.log(oldYear + " === " + req.body.year);


    let usersQuery = {
      where: {
        [Op.or]: [
          { group: oldGroup },
          { group: null }
        ]
      }
    };
    
    if (oldGroup) {
      usersQuery = {
        where: {
          [Op.or]: [
            { group: oldGroup },
            { group: null }
          ]
        }
      };
    }

    // Update associated users' group information group year has changed
    if (oldYear !== req.body.year && (vargroup.group !== "Admin" && vargroup.group !== "Male Teacher" && vargroup.group !== "Female Teacher" && vargroup.group !== "Principal")) {
      const users = await db.users.findAll(usersQuery);
      console.log("TRIGGERED");
      for (const user of users) {
        const assignedGroup = assignGroup(await db.groups.findAll(), user.studentDob);
        user.group = assignedGroup;
        await user.save();
      }
    }

    return res.json(vargroup);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Updating Data" });
  }
};

// Remove a group from the database.
exports.delete = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const getSyllabus = await db.syllabus.findAll({ where: { groupId: id } });
    if (getSyllabus !== null) {
      await db.syllabus.destroy({ where: { groupId: id } });
      console.log("Deleted all Syllabus asscoiated with " + id);
    }

    const group = await db.groups.findByPk(id);
    if (group !== null) {
      await group.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


