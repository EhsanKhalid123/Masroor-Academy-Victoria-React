
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/registeredController.js");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", validateToken, controller.all);

  // Select a single user with id.
  router.get("/select/:email", validateToken, controller.one);

  // Select a single user with id.
  router.get("/get/:id", validateToken, controller.one2);

  // Deletes a user from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Create a updates user details.
  router.post("/update/:email", validateToken, controller.update);

  // Create a new user.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/MAApi/registered", router);
};