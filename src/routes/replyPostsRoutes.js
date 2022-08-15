
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
    // Importing libraries and files
    const controller = require("../controllers/replyPostsController.js");
    const router = express.Router();

    // Select all posts.
    router.get("/", controller.all);

    // Deletes a Replied post from the DB.
    router.post("/delete", controller.delete);

    // Deletes all Replied post from the DB for a specific Post ID.
    router.post("/delete2", controller.delete2);

    // Deletes all Replied post for the user being deleted from the DB for a specific Post ID.
    router.post("/delete3", controller.delete3);

    // Create a Reply to a post.
    router.post("/create", controller.create);

    // Add routes to server.
    app.use("/VCApi/replyPosts", router);
};
