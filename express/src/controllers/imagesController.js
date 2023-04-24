
// Import all database files
const db = require("../database");

// Endpoint for uploading an image and saving it in the database.
exports.upload = async (req, res) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    // Save the image file to the database.
    const uploadImage = await db.images.create({
      image: imageFile.buffer
    });

    // Construct the image URL using the ID of the saved image.
    const imageUrl = `${req.protocol}://${req.get('host')}/image/${uploadImage.id}`;

    // Return the image URL as a response.
    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Get the image data from the database using the image ID.
    const image = await db.images.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found.' });
    }

    // Send the image data back to the client.
    res.set('Content-Type', 'image/jpeg');
    res.send(image.image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get image.' });
  }
};