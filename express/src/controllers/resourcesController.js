
// Import all database files
const db = require("../database");


// Endpoint for uploading an resource and saving it in the database.
exports.upload = async (req, res) => {
    try {
        const resource = req.file;

        if (!resource) {
            return res.status(400).json({ error: 'No file provided.' });
        }

        // Save the resource file to the database.
        const uploadResource = await db.resources.create({
            filename: resource.originalname,
            mimetype: resource.mimetype,
            size: resource.size,
            data: resource.buffer
        });

        // Stores uploaded resource file name in variable
        const filename = `${uploadResource.filename}`;

        // Return the filename of the resource as a response.
        res.json({ filename: filename });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Failed to upload resource.' });
    }
};

// Endpoint for retrieving stored resources
exports.getResource = async (req, res) => {
    try {
        const resourceID = req.params.id;

        // Get the resource data from the database using the resource ID.
        const resource = await db.resources.findByPk(resourceID);

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found.' });
        }

        // const resourceUrl = `${req.protocol}://${req.get('host')}/MAApi/resources/${resource.filename}`;

        // Set the Content-Disposition header to attachment and send the file data in the response body
        // res.set('Content-Disposition', `attachment; filename=${resource.filename}`);
        // res.set('Content-Type', resource.mimetype);
        res.send(resource.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get resource.' });
    }
};

// Endpoint for retrieving stored resources
exports.all = async (req, res) => {
    try {
        // Gets all posts from DB and does Eager Loading to display User information related to the user who made posts.
        const resources = await db.resources.findAll();
        res.json(resources);
    } catch (error) {
        // Send an error response.
        res.status(500).json({ message: "Error Retrieving Data" });
    }
};

// Remove an announcement from the database.
exports.delete = async (req, res) => {
    try {
        const resourceID = req.body.id;

        let removed = false;

        const resources = await db.resources.findByPk(resourceID);
        if (resources !== null) {
            await resources.destroy();
            removed = true;
        }

        return res.json(removed);
    } catch (error) {
        // Send an error response.
        res.status(500).json({ message: "Error Deleting Data" });
    }
};
