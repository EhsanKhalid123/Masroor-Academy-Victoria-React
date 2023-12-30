
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/attendanceController");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");


  // Get all Attendance.
  router.get("/", validateToken, controller.all);

  // Get selected Attendance.
  router.get("/:date", validateToken, controller.selected);

  // Update Attendance.
  router.post("/update/:date", validateToken, controller.update);

  // Delete Attendance Record
  router.post("/delete", validateToken, controller.delete);

  // Create Attendance Record.
  router.post("/", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/attendance", router);
};