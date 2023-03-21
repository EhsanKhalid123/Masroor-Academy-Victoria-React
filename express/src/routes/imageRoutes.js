
module.exports = (express, app) => {
  const controller = require('../controllers/imagesController.js');
  const router = express.Router();

  const fs = require('fs');
  const path = require('path');
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage: storage });

  // Upload an Image.
  router.post('/upload', upload.single("upload"), controller.upload);

  // Add routes to server.
  app.use('/MAApi/image', router);
};