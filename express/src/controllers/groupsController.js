// Old fashioned Import statements for libraries and files
const db = require("../database");

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
    });

    res.json(group);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update group Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const vargroup = await db.groups.findByPk(id);

    vargroup.group = req.body.group;

    await vargroup.save();

    return res.json(vargroup);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Updating Data" });
  }
};

// Remove a group from the database.
exports.delete = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const group = await db.groups.findByPk(id);
    if (group !== null) {
      await group.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


