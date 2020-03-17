/*

Exordium API
Author: FearGannicus <contact@exordium.dev> (https://exordium.dev)
Date: 2020-03-16

*/

// Modules
const dotenv = require('dotenv');
const express = require('express');
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

// Create server on the PORT
app.listen(port, () => {
  console.log('Exordium API. Now running...')
  console.log(`https://${process.env.APP_HOSTNAME}:${port}/`);
});

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
