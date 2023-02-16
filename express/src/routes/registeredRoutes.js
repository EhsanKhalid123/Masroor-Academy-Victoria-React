
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/registeredController.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:email", controller.one);

  // Select a single user with id.
  router.get("/get/:id", controller.one2);

  // Deletes a user from the DB.
  router.post("/delete", controller.delete);

  // Create a updates user details.
  router.post("/update/:email", controller.update);

  // Create a new user.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/MAApi/registered", router);
};