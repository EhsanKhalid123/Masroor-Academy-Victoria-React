// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for Select all classes from the database.
exports.all = async (req, res) => {
  try {
    const varClasses = await db.classes.findAll();

    res.json(varClasses);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one class from the database.
exports.one = async (req, res) => {
  try {
    const varClasses = await db.classes.findByPk(req.params.id);

    res.json(varClasses);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Create a class in the database.
exports.create = async (req, res) => {
  try {

    // Following properties are required for class to be created in DB
    const varClasses = await db.classes.create({
      id: req.body.id,
      class: req.body.class,
    });

    res.json(varClasses);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update class Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const varClasses = await db.classes.findByPk(id);

    const oldClass = varClasses.class; // Store the old group name for comparison

    varClasses.class = req.body.class;

    await varClasses.save();

    // Update associated users' group information
    if (oldClass !== req.body.class) {
      const users = await db.users.findAll({ where: { class: oldClass } });

      for (const user of users) {
        user.class = req.body.class;
        await user.save();
      }
    }

    return res.json(varClasses);
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

    const varClasses = await db.classes.findByPk(id);
    if (varClasses !== null) {
      await varClasses.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


