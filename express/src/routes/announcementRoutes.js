
/* REFERENCE:
   Some of the Code below is taken & adapted from Lab Examples of Week 8 and 9. 
*/

module.exports = (express, app) => {
    // Importing libraries and files
    const controller = require("../controllers/announcementController.js");
    const router = express.Router();

    // Select all posts.
    router.get("/", controller.all);

    // Deletes a Replied post from the DB.
    router.post("/delete", controller.delete);

    // Create a Reply to a post.
    router.post("/create", controller.create);

    // Add routes to server.
    app.use("/MAApi/announcements", router);
};
