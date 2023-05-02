
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
    // Importing libraries and files
    const controller = require("../controllers/announcementController.js");
    const router = express.Router();
    const { validateToken } = require("../middlewares/AuthMiddleware.js");

    // Select all posts.
    router.get("/", validateToken, controller.all);

    // Deletes a Replied post from the DB.
    router.post("/delete", validateToken, controller.delete);

    // Create a Reply to a post.
    router.post("/create", validateToken, controller.create);

    // Add routes to server.
    app.use("/MAApi/announcements", router);
};
