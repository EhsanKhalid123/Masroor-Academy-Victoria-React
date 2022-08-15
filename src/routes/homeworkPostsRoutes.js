
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
  // Importing libraries and files
  const controller = require("../controllers/homeworkPostsController.js");
  const router = express.Router();

  // Select all posts.
  router.get("/", controller.all);

  // Deletes a post from the DB.
  router.post("/delete", controller.delete);

  // Deletes all posts of a specific user from DB.
  router.post("/delete2", controller.delete2);

  // Create a new post.
  router.post("/create", controller.create);

  // Add routes to server.
  app.use("/VCApi/posts", router);
};
