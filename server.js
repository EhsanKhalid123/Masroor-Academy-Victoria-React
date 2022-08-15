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
// app.get("/", (req, res) => {
//   res.json({ message: "Hello World!" });
// });

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

if (process.env.NODE_ENV === "production"){
  app.use(express.static('react/build'))
}

// var https = require("http");
//   setInterval(function() {
//     https.get("https://masroor-academy-victoria.herokuapp.com/");
// }, 100000); // every 5 minutes (300000)

var http = require("http");
setInterval(function() {
    http.get("http://masroor-academy-victoria.herokuapp.com/");
}, 100000); // every 5 minutes (300000)

(function wakeup() {
  require('open')('https://masroor-academy-victoria.herokuapp.com/', (err) => {
    if (err) throw err;
    console.log('Woke up!');
    setTimeout(wakeup, 100000); //29m
  });
})();

var tcpp = require('tcp-ping');
tcpp.ping({ address: 'https://masroor-academy-victoria.herokuapp.com/', port: 443 }, function(err, data) {
    console.log(data, err);
});

// Set port, listen for requests.
// Starts the Server on Port 4000.
const PORT = 4000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});