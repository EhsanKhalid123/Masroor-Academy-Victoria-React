
// Import all database files
const db = require("../database");

// Endpoint for selecting all announcements from the database.
exports.getFormStatusAndText = async (req, res) => {
   
    // Gets the current form status from DB.
    const formStatus = await db.formStatus.findByPk("formStatus");

    // Extract the status and text fields from the form status object.
    const { status, text } = formStatus;
  
    res.json({ status, text });
};

// Endpoint for updating form status in the database.
exports.updateFormStatus = async (req, res) => {
    try {
        // Get the form status values from the request body.
        const status = req.body.status;

        // Find the form status record in the database.
        const formStatus = await db.formStatus.findByPk("formStatus");

        // Update the form status and text values.
        formStatus.status = status;

        // Save the changes to the database.
        await formStatus.save();

        // Send a success response.
        res.status(200).json({ message: "Form status updated successfully" });
    } catch (error) {
        // Send an error response.
        res.status(500).json({ message: "Error updating form status" });
    }
};

// Endpoint for updating form text in the database.
exports.updateFormText = async (req, res) => {
    try {
        // Get the form status and text values from the request body.
        const text = req.body.text;

        // Find the form status record in the database.
        const formText = await db.formStatus.findByPk("formStatus");

        // Update the form text values.
        formText.text = text;

        // Save the changes to the database.
        await formText.save();

        // Send a success response.
        res.status(200).json({ message: "Form text updated successfully" });
    } catch (error) {
        // Send an error response.
        res.status(500).json({ message: "Error updating form text" });
    }
};

