
// Import all database files
const db = require("../database");
const fs = require('fs');

// exports.upload = async (req, res) => {
//   const { path } = req.file;
//   try {
//     const data = await db.images.create({
//       name: req.file.originalname,
//       data: fs.readFileSync(path),
//     });
//     console.log(data);
//     res.status(200).json({
//       message: "Image uploaded successfully!",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error uploading image!",
//     });
//   }
// };

// exports.upload = async (req, res) => {
//     try {
//       const imageFile = req.file;
  
//       if (!imageFile) {
//         return res.status(400).json({ error: 'No file provided.' });
//       }
  
//       // Save the image file to the database.
//       const image = await db.images.create({
//         Image: imageFile.buffer,
//       });
  
//       // Construct the image URL using the ID of the saved image.
//       const imageUrl = `/MAApi/image/${image.id}`;
  
//       // Return the image URL as a response.
//       res.json({ url: imageUrl });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to upload image.' });
//     }
//   };


// Endpoint for uploading an image and saving it in the database.
exports.upload = async (req, res) => {
    try {
      // Get the uploaded image file.
    //   const imageFile = req.files.file;
      const imageFile = req.file;
  
      // Save the image file to the database.
      const image = await db.images.create({
        Image: imageFile.data
      });
  
      // Construct the image URL using the ID of the saved image.
      const imageUrl = `/MAApi/image/${image.id}`;
  
      // Return the image URL as a response.
      res.json({ url: imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload image." });
    }
  };
