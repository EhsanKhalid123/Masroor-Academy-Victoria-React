
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/usersController.js");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", validateToken, controller.all);

  // Select a single user with id.
  router.get("/get/:id", validateToken, controller.one);

  // Select a single user with id.
  router.get("/getRegister/:id", controller.oneRegister);

  // Check if student and parent name already exists in one row.
  router.post("/check", controller.check);

  // Select one user from the database if username and password are a match.
  router.post("/Sign-in", controller.login);

  // Deletes a user from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Create a updates user details.
  router.post("/update/:id", validateToken, controller.update);

  // Create a new user.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/MAApi/users", router);
};