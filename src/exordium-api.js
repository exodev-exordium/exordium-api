/*
Exordium API
Author: FearGannicus <gannicus@exordium.org> (https://exordium.dev)
Date: 2020-03-16
*/

// Modules
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan')

// Grab the .env configuration
dotenv.config();

const dbConfig = require('./database/db'); // Require Database Connection

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

mongoose.set('useCreateIndex', true); // Remove MongoDB warning error

// Setup the server
const app = express();
app.use(express.json());
//app.use(cors());


/* =================================
 *  MORGAN LOGGING
 * ================================= */

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' })
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', { stream: accessLogStream }));


/* =================================
 *  PUBLIC ROUTING
 * ================================= */

app.use('/public/uploads/blog', express.static(path.join(__dirname, '../uploads/blog'))); // blog images
app.use('/public/uploads/users', express.static(path.join(__dirname, '../uploads/users'))); // user avatar images

const publicContact = require('./routes/public/public.contact');
app.use('/public/contact', publicContact); // contact router

const publicBlog = require('./routes/public/public.blog');
app.use('/public/blog', publicBlog); // blog Router

//const publicServers = require('./routes/public/public.servers');
//app.use('/public/servers', publicServers); // servers Router


/* =================================
 *  CLIENT ROUTING
 * ================================= */

const clientAuth = require('./routes/clients/clients.auth');
app.use('/auth', clientAuth); // Client Auth Routers

const clientMe = require('./routes/clients/clients.me');
app.use('/user/me', clientMe); // Client Me Routers


/* =================================
 *  MANAGEMENT ROUTING
 * ================================= */

//const managementWatchdog = require('./routes/management/management.watchdog');
//app.use('/management/watchdog', managementWatchdog); // Management Blogs Routers

const managementContact = require('./routes/management/management.contact');
app.use('/management/contact', managementContact); // Management Contact Routers

const managementUsers = require('./routes/management/management.users');
app.use('/management/users', managementUsers); // Management Users Routers

const managementBlogs = require('./routes/management/management.blog');
app.use('/management/blogs', managementBlogs); // Management Blogs Routers

//const managementDevBlog = require('./routes/management/management.devblog');
//app.use('/management/devblog', managementDevBlog); // Management Dev Blog Routers


/* =================================
 *  EXPRESS ERROR HANDLING
 * ================================= */

app.use((req, res, next) => {
  setImmediate(() => {
      next(new Error(`Request could not be completed. Internal server error.`));
  });
});
app.use(function (err, req, res, next) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message
  });
});


/* =================================
 *  CREATE SERVER
 * ================================= */

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Exordium API. Running: \thttps://${process.env.APP_HOSTNAME}:${port}/`)
});
