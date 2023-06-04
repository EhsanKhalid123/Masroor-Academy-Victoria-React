
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/syllabusController");
  const router = express.Router();
  const {validateToken} = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", validateToken, controller.all);

  // Select a single user with id.
  router.get("/get/:id", validateToken, controller.one);

  // Deletes a user from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Updates Syllabus
  router.post("/update", validateToken, controller.update);

  // Create a new user.
  router.post("/", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/syllabus", router);
};