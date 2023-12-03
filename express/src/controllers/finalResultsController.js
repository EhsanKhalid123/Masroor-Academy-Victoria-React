// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for selecting attendance for a specific date
exports.all = async (req, res) => {

  try {

    const finalResults = await db.finalResults.findAll();

    res.json(finalResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Endpoint for selecting attendance for a specific date
exports.getByID = async (req, res) => {
  const studentID = req.params.studentID;

  try {
    // Query the database using the provided classname and studentID
    const finalResults = await db.finalResults.findByPk(studentID);

    res.json(finalResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new attendance record
exports.create = async (req, res) => {
  const { fathersName, mothersName, parentEmail, studentID, studentName, studentGroup, studentEmail, attendanceResult } = req.body;

  // Fetch result records where studentID matches
  const resultRecords = await db.results.findAll({
    attributes: ['class', 'result'],
    where: { studentID: studentID }
  });

  // Create an array to store the subjectResult data
  const subjectResultArray = [];

  // Populate the subjectResultArray
  if (resultRecords) {
    resultRecords.forEach((record) => {
      const { class: className, result } = record;
      const subjectEntry = { [className]: result };
      subjectResultArray.push(subjectEntry);
    });
  }

  // Calculate the total result percentage without '%' symbol
  let totalResult = 0;
  subjectResultArray.forEach((entry) => {
    for (const key in entry) {
      const percentageString = entry[key];
      const percentageWithoutSymbol = parseFloat(percentageString.replace('%', ''));
      totalResult += percentageWithoutSymbol;
    }
  });

  const totalClasses = await db.classes.count(); // Count the total number of classes
  const resultValue = totalResult / totalClasses; // Calculate the average result

  try {
    const finalResults = await db.finalResults.create({
      studentID: studentID,
      studentName: studentName,
      studentGroup: studentGroup,
      fathersName: fathersName,
      mothersName: mothersName,
      parentEmail: parentEmail,
      studentEmail: studentEmail,
      subjectResult: subjectResultArray,
      finalResult: resultValue + "%",
      attendanceResult: attendanceResult + "%"
    });
    res.json(finalResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update the attendance record for a specific date
exports.update = async (req, res) => {
  const studentID = req.params.studentID;

  const { attendanceResult } = req.body;

  // Fetch result records where studentID matches
  const resultRecords = await db.results.findAll({
    attributes: ['class', 'result'],
    where: { studentID: studentID }
  });

  // Create an array to store the subjectResult data
  const subjectResultArray = [];

  // Populate the subjectResultArray
  resultRecords.forEach((record) => {
    const { class: className, result } = record;
    const subjectEntry = { [className]: result };
    subjectResultArray.push(subjectEntry);
  });

  // Calculate the total result percentage without '%' symbol
  let totalResult = 0;
  subjectResultArray.forEach((entry) => {
    for (const key in entry) {
      const percentageString = entry[key];
      const percentageWithoutSymbol = parseFloat(percentageString.replace('%', ''));
      totalResult += percentageWithoutSymbol;
    }
  });

  const totalClasses = await db.classes.count(); // Count the total number of classes
  const resultValue = totalResult / totalClasses; // Calculate the average result

  try {
    const finalResults = await db.finalResults.findOne({
      where: { studentID: studentID },
    });

    if (finalResults) {

      if (attendanceResult !== null) {
        finalResults.attendanceResult = attendanceResult + "%"
      }

      finalResults.subjectResult = subjectResultArray,
        finalResults.finalResult = resultValue + "%"
      await finalResults.save();
      res.json(finalResults);
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

    const finalResults = await db.finalResults.findByPk(id);
    if (finalResults !== null) {
      await finalResults.destroy();
      removed = true;
    }

    return res.json(removed);
  } catch (error) {
    console.log(error);
    // Send an error response.
    res.status(500).json({ error: 'Internal server error' });
  }
};

