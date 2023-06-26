// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for selecting attendance for a specific date
exports.all = async (req, res) => {

  try {

    const result = await db.results.findAll();

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Endpoint for selecting attendance for a specific date
exports.selected = async (req, res) => {
  const classname = req.params.classname;
  const studentID = req.params.studentID;

  try {
    // Query the database using the provided classname and studentID
    const result = await db.results.findOne({
      where: { class: classname, studentID: studentID },
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new attendance record
exports.create = async (req, res) => {
  const { classname, results, studentID } = req.body;

  try {
    const result = await db.results.create({
      studentID: studentID,
      class: classname,
      result: results,
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update the attendance record for a specific date
exports.update = async (req, res) => {
  const classname = req.params.classname;
  const studentID = req.params.studentID;
  const { results } = req.body;

  try {
    const result = await db.results.findOne({
      where: { class: classname, studentID: studentID },
    });
    if (result) {
      result.result = results;
      await result.save();
      res.json(result);
    } else {
      res.status(404).json({ error: 'Attendance not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete the attendance record for a specific date
exports.delete = async (req, res) => {
  try {

    const classname = req.body.classname;

    let removed = false;

    const result = await db.results.findByPk(classname);
    if (result !== null) {
      await result.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ error: 'Internal server error' });
  }
};

