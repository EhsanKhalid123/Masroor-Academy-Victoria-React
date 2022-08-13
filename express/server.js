// Server.js is to start the server and create tables from index.js
// Import Libraries
const express = require("express");
const cors = require("cors");
const db = require("./src/database");

// Database will be sync'ed in the background.
// Create the tables as the server runs. Function called from index.js.
db.sync();

// Starts Express App Instance.
// Creates an Instance of Express.
const app = express();

// Parse requests of content-type - application/json.
app.use(express.json());

// Add CORS suport.
app.use(cors());

// Simple Hello World route.
// Sample Endpoint added in this page.
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Sample Endpoint
app.get("/users", async (req, res) => {
  const users = await db.users.findAll();
  res.json(users);
});

// Add user routes.
// Endpoints imported from other folder to keep code clean. Routes gets the URL link info and then imports controllers that have endpoints.
require("./src/routes/usersRoutes.js")(express, app);
require("./src/routes/homeworkPostsRoutes.js")(express, app);
require("./src/routes/replyPostsRoutes.js")(express, app);

// Set port, listen for requests.
// Starts the Server on Port 4000.
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});