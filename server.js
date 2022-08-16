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

// // List of all the files that should be served as-is
// let protected = ['About.js', 'App.css', 'Masroor Academy Victoria 2.ico', 'Announcement.js', 'Dashboard.js', 'ErrorPage.js', 'Home.js', 'Homework.js', 'Login.js', 'Sign-in']

// app.get("*", (req, res) => {

//   let path = req.params['0'].substring(1)

//   if (protected.includes(path)) {
//     // Return the actual file
//     res.sendFile(`react/build/${path}`);
//   } else {
//     // Otherwise, redirect to /build/index.html
//     res.sendFile(`react/build/index.html`);
//   }
// });

// app.get("*", (req, res) => {
//   let url = path.join(__dirname, 'react/build', 'index.html');
//   if (!url.startsWith('/app/')) // since we're on local windows
//     url = url.substring(1);
//   res.sendFile(url);
// });

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