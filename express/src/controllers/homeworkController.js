// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for Select all classes from the database.
exports.all = async (req, res) => {
  try {
    const varHomework = await db.homework.findAll();

    res.json(varHomework);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one class from the database.
exports.one = async (req, res) => {
  try {
    const varHomework = await db.homework.findByPk(req.params.id);

    res.json(varHomework);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Create a class in the database.
exports.create = async (req, res) => {
  try {

    // Following properties are required for class to be created in DB
    const varHomework = await db.homework.create({
      homework: req.body.homework,
      classname: req.body.classname,
      group: req.body.group
    });

    res.json(varHomework);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update class Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const varHomework = await db.homework.findByPk(id);

    varHomework.homework = req.body.homework;
    varHomework.classname = req.body.classname;
    varHomework.group = req.body.group;

    await varHomework.save();

    return res.json(varHomework);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Updating Data" });
  }
};

// Remove a class from the database.
exports.delete = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const varHomework = await db.homework.findByPk(id);
    if (varHomework !== null) {
      await varHomework.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


