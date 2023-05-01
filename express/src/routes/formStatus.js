

module.exports = (express, app) => {
    // Importing libraries and files
    const controller = require("../controllers/formStatus.js");
    const router = express.Router();
    const { validateToken } = require("../middlewares/AuthMiddleware.js");
  
    // Select all users.
    router.get("/", controller.getFormStatusAndText);
 
    router.post("/updateFormStatus", controller.updateFormStatus);

    router.post("/updateFormText", controller.updateFormText);
  
    // Add routes to server.
    app.use("/MAApi/formStatus", router);
  };