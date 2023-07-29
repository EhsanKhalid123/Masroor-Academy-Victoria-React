
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/homeworkPostsController.js");
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Get all posts.
  router.get("/", validateToken, controller.all);

  // Get selected Homework Posts.
  router.get("/get/:classname/:studentID", validateToken, controller.selected);

  // Updates homework details.
  router.post("/update/:classname/:studentID", validateToken, controller.update);

  // Deletes a post from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Deletes all posts of a specific user from DB.
  router.post("/delete2", validateToken, controller.delete2);

  // Deletes homework details.
  router.post("/delete3/:classname/:studentID", validateToken, controller.deleteByID);

  // Create a new post.
  router.post("/create", validateToken, controller.create);

  // Add routes to server.
  app.use("/MAApi/homeworks", router);
};
