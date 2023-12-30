// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for Select all syllabus from the database.
exports.all = async (req, res) => {
  try {
    const syllabus = await db.syllabus.findAll();

    res.json(syllabus);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Select one syllabus from the database.
exports.one = async (req, res) => {
  try {
    const syllabus = await db.syllabus.findOne({ where: { groupId: req.params.id } });
    console.log(syllabus);
    res.json(syllabus);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Retrieving Data" });
  }
};

// Create a syllabus in the database.
exports.create = async (req, res) => {
  try {

    // Following properties are required for syllabus to be created in DB
    const syllabus = await db.syllabus.create({

      syllabusContent: req.body.syllabus,
      groupId: req.body.groupId
    });

    res.json(syllabus);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Creating Data" });
  }
};

// Update syllabus Details in the database.
exports.update = async (req, res) => {
  try {
    const id = req.body.groupId;

    const syllabus = await db.syllabus.findOne({ where: { groupId: id } });

    syllabus.syllabusContent = req.body.syllabus;

    await syllabus.save();

    return res.json(syllabus);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Updating Data" });
  }
};

// Remove a syllabus from the database.
exports.delete = async (req, res) => {
  try {
    const id = req.body.id;

    let removed = false;

    const syllabus = await db.syllabus.findByPk(id);
    if (syllabus !== null) {
      await syllabus.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    // Send an error response.
    res.status(500).json({ message: "Error Deleting Data" });
  }
};


