
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/usersController.js");
  const router = express.Router();
  const {validateToken} = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:email", controller.one);

  // Select a single user with id.
  router.get("/get/:id", controller.one2);

  // Select one user from the database if username and password are a match.
  router.post("/Sign-in", controller.login);

  // Deletes a user from the DB.
  router.post("/delete", controller.delete);

  // Create a updates user details.
  router.post("/update/:email", controller.update);

  // Create a new user.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/MAApi/users", router);
};