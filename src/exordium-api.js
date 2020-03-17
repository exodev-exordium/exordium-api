/*

Exordium API
Author: FearGannicus <contact@exordium.dev> (https://exordium.dev)
Date: 2020-03-16

*/

// Modules
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Grab the .env configuration
dotenv.config();

// Setup the server
const app = express();
const port = process.env.PORT || 3000;

// Require Database Connection
const config = require('./database/config');
const connection = require('./database/connection');
const getQuery = require('./database/getQuery');

// Require Routers
const authTokenRouter = require('./routes/auth/token');

// Add Directory Routing
app.use('/auth', authTokenRouter);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

// CORS
app.use(cors());

// Error: 403
app.use(function(req, res) {
  res.status(404).send({
    status: false,
    msg: 'The data you requested could not be found.',
    url: req.originalUrl + ' not found'
  })
});

// Error: 403
app.use(function(req, res) {
  res.status(403).send({
    status: false,
    msg: 'Invalid or incorrect Authorization Bearer Token. Please make sure you use the correct one.',
    url: req.originalUrl + ' forbidden.'
  })
});

// Create server on the PORT
app.listen(port, () => {
  console.log('Exordium API. Now running...')
  console.log(`https://${process.env.APP_HOSTNAME}:${port}/`);
});
