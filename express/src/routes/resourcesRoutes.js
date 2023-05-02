
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (express, app) => {
  const controller = require('../controllers/resourcesController.js');
  const router = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Supposed to remove API Link from Console
  router.use((req, res, next) => {
    res.set('Referrer-Policy', 'no-referrer');
    next();
  });

  // Get the uploaded resource by ID
  router.get('/:id', validateToken, controller.getResource);

  // Get the uploaded resource
  router.get('/', validateToken, controller.all);

  router.post('/upload', validateToken, upload.single('file'), controller.upload);

  // Deletes a resource from the DB.
  router.post("/delete", validateToken, controller.delete);

  // Add routes to server.
  app.use('/MAApi/resources', router);
};