// Old fashioned Import statements for libraries and files
const db = require("../database");

// Endpoint for selecting attendance for a specific date
exports.all = async (req, res) => {
  const dateParam = req.params.date;

  try {
    // Convert the date parameter to a valid JavaScript Date object
    const date = new Date(dateParam);

    // Query the database using the converted date
    const attendance = await db.attendance.findOne({
      where: { date: date },
    });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new attendance record
exports.create = async (req, res) => {
    const { date, students } = req.body;
  
    try {
      const attendance = await db.attendance.create({
        date: date,
        students: students,
      });
      res.json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Update the attendance record for a specific date
  exports.update = async (req, res) => {
    const date = req.params.date;
    const { students } = req.body;
  
    try {
      const attendance = await db.attendance.findOne({
        where: { date: date },
      });
      if (attendance) {
        attendance.students = students;
        await attendance.save();
        res.json(attendance);
      } else {
        res.status(404).json({ error: 'Attendance not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Delete the attendance record for a specific date
  exports.delete = async (req, res) => {
    const { date } = req.params;
  
    try {
      const attendance = await db.attendance.findOne({
        where: { date: date },
      });
      if (attendance) {
        await attendance.destroy();
        res.json({ message: 'Attendance deleted successfully' });
      } else {
        res.status(404).json({ error: 'Attendance not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

