
module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/groupsController");
  const router = express.Router();
  const {validateToken} = require("../middlewares/AuthMiddleware.js");

  // Select all users.
  router.get("/", validateToken, controller.all);

  // Select a single user with id.
  router.get("/get/:id", controller.one);

  // Deletes a user from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Create a new user.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/MAApi/groups", router);
};