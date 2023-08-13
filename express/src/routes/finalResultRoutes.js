
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/finalResultsController");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");


  // Get all Attendance.
  router.get("/", validateToken, controller.all);

  // Get selected Attendance.
  router.get("/get/:studentID", validateToken, controller.getByID);

  // Update Attendance.
  router.post("/update/:studentID", validateToken, controller.update);

  // Delete Attendance Record
  router.post("/delete", validateToken, controller.delete);

  // Create Attendance Record.
  router.post("/", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/finalResults", router);
};