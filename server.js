// Server.js is to start the server and create tables from index.js
// Import Libraries
const express = require("express");
const cors = require("cors");
const db = require("./src/database");
const path = require('path');

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


// Add user routes.
// Endpoints imported from other folder to keep code clean. Routes gets the URL link info and then imports controllers that have endpoints.
require("./src/routes/usersRoutes.js")(express, app);
require("./src/routes/homeworkPostsRoutes.js")(express, app);
require("./src/routes/announcementRoutes.js")(express, app);
require("./src/routes/formStatusRoutes.js")(express, app);
require("./src/routes/imageRoutes.js")(express, app);
require("./src/routes/resourcesRoutes.js")(express, app);
require("./src/routes/classesRoutes.js")(express, app);
require("./src/routes/groupsRoutes.js")(express, app);
require("./src/routes/syllabusRoutes.js")(express, app);
require("./src/routes/attendanceRoutes.js")(express, app);
require("./src/routes/homeworkRoutes.js")(express, app);
require("./src/routes/resultRoutes.js")(express, app);
require("./src/routes/finalResultRoutes.js")(express, app);


app.use(express.static(path.join(__dirname, 'react/build')));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/react/build/index.html'));
});


// Set port, listen for requests.
// Starts the Server on Port 4000.
const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});