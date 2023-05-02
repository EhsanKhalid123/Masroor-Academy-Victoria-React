const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (express, app) => {
  const controller = require('../controllers/imagesController.js');
  const uploadImageRouter = express.Router();
  const getImageRouter = express.Router();
  const { validateToken } = require("../middlewares/AuthMiddleware.js");

  // Get an Image
  getImageRouter.get('/:id', validateToken, controller.getImage);
    
  // Upload an Image.
  uploadImageRouter.post('/upload', validateToken, upload.single('upload'), controller.upload);

  // Add routes to server.
  app.use('/MAApi/image', uploadImageRouter);
  app.use('/image', getImageRouter);
};