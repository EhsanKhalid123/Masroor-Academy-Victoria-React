

module.exports = (express, app) => {
    // Importing libraries and files
    const controller = require("../controllers/formStatusController.js");
    const router = express.Router();
    const { validateToken } = require("../middlewares/AuthMiddleware.js");
  
    // Select all users.
    router.get("/", validateToken, controller.getFormStatusAndText);
 
    router.post("/updateFormStatus", validateToken, controller.updateFormStatus);

    router.post("/updateFormText", validateToken, controller.updateFormText);
  
    // Add routes to server.
    app.use("/MAApi/formStatus", router);
  };