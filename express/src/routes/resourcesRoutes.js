
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (express, app) => {
  const controller = require('../controllers/resourcesController.js');
  const router = express.Router();


  // Get the uploaded resource by ID
  router.get('/:id', controller.getResource);

  // Get the uploaded resource
  router.get('/', controller.all);

  router.post('/upload', upload.single('file'), controller.upload);

  // Deletes a resource from the DB.
  router.post("/delete", controller.delete);

  // Add routes to server.
  app.use('/MAApi/resources', router);
};