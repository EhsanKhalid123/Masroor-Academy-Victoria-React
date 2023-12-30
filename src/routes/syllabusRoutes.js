
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/syllabusController");
  const router = express.Router();
  const {validateToken} = require("../middlewares/AuthMiddleware.js");

  // Get all Syllabus.
  router.get("/", validateToken, controller.all);

  // Get a single Syllabus with id.
  router.get("/get/:id", validateToken, controller.one);

  // Deletes a Syllabus from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Updates Syllabus
  router.post("/update", validateToken, controller.update);

  // Create a new Syllabus.
  router.post("/", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/syllabus", router);
};