// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for selecting attendance for a specific date
exports.all = async (req, res) => {

  try {

    const results = await db.results.findAll();

    res.json(results);
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
    const results = await db.results.findOne({
      where: { class: classname, studentID: studentID },
    });

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Endpoint for selecting attendance for a specific date
exports.getByID = async (req, res) => {
  const id = req.params.id;

  try {
    // Query the database using the provided classname and studentID
    const results = await db.results.findByPk(id);

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new attendance record
exports.create = async (req, res) => {
  const { classname, markedHomeworks, studentID, studentGroup, studentResult } = req.body;

  try {
    const results = await db.results.create({
      studentID: studentID,
      studentGroup: studentGroup,
      class: classname,
      markedHomework: markedHomeworks,
      result: studentResult
    });
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update the attendance record for a specific date
exports.update = async (req, res) => {
  const classname = req.params.classname;
  const studentID = req.params.studentID;

  const { markedHomeworks, studentGroup, studentResult } = req.body;

  try {
    const results = await db.results.findOne({
      where: { class: classname, studentID: studentID },
    });
    if (results) {
      results.markedHomework = markedHomeworks;
      results.studentGroup = studentGroup;
      results.result = studentResult;
      await results.save();
      res.json(results);
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

    const id = req.body.resultID;

    let removed = false;

    const result = await db.results.findByPk(id);
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

