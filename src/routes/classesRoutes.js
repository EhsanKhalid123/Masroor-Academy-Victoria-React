
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/classesController");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", validateToken, controller.all);

  // Select a single user with id.
  router.get("/get/:id", validateToken, controller.one);

  // Create a updates user details.
  router.post("/update/:id", validateToken, controller.update);

  // Deletes a user from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Create a new user.
  router.post("/", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/classes", router);
};