/*
Exordium API
Author: FearGannicus <gannicus@exordium.org> (https://exordium.dev)
Date: 2020-03-16
*/

// Modules
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Grab the .env configuration
dotenv.config();

// Require Database Connection
const dbConfig = require('./database/db');

// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
  () => {
    console.log('Mongodb: Connected');
  },
  error => {
    console.log("Mongodb: Database can't be connected: " + error);
  }
)

// Remove MongoDB warning error
mongoose.set('useCreateIndex', true);

// Setup the server
const app = express();
app.use(express.json());
app.use(cors());


// Contact Router
const publicContact = require('./routes/public/public.contact');
app.use('/public/contact', publicContact);
// Blog Router
const publicBlog = require('./routes/public/public.blog');
app.use('/public/blog', publicBlog);
// Servers Router
//const publicServers = require('./routes/public/public.servers');
//app.use('/public/servers', publicServers);


// Client Auth Routers
const clientAuth = require('./routes/clients/clients.auth');
app.use('/auth', clientAuth);
// Client Me Routers
const clientMe = require('./routes/clients/clients.me');
app.use('/user/me', clientMe);


// Management Blogs Routers
//const managementWatchdog = require('./routes/management/management.watchdog');
//app.use('/management/watchdog', managementWatchdog);
// Management Contact Routers
const managementContact = require('./routes/management/management.contact');
app.use('/management/contact', managementContact);
// Management Users Routers
const managementUsers = require('./routes/management/management.users');
app.use('/management/users', managementUsers);
// Management Blogs Routers
const managementBlogs = require('./routes/management/management.blog');
app.use('/management/blogs', managementBlogs);
// Management Dev Blog Routers
//const managementDevBlog = require('./routes/management/management.devblog');
//app.use('/management/devblog', managementDevBlog);


// Create server on the PORT
const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Exordium API. Running: \thttps://${process.env.APP_HOSTNAME}:${port}/`)
});

// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
      next(new Error(`Internal Server Error`));
  });
});
app.use(function (err, req, res, next) {
  var IPAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var URLAddress = req.protocol + '://' + req.get('host') + req.originalUrl;

  if (!err.statusCode) {
    err.statusCode = 500;
  }

  console.error(`[${IPAddress}] | Status: ${err.statusCode}:\tURL: ${URLAddress}: ${err.message}`);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
    ipAddr: IPAddress
  });
});
