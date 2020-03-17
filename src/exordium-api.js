/*

Exordium API
Author: FearGannicus <contact@exordium.dev> (https://exordium.dev)
Date: 2020-03-16

*/

// Require .env
require('dotenv').config()

// Require Express
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

// Create server on the PORT
app.listen(port);

// Custom 404 Erroring
app.use(function(req, res) {
  res.status(404).send({
    status: false,
    msg: 'The data you requested could not be found.',
    url: req.originalUrl + ' not found'
  })
});

// Custom 403 Erroring
app.use(function(req, res) {
  res.status(403).send({
    status: false,
    msg: 'Invalid or incorrect Authorization Bearer Token. Please make sure you use the correct one.',
    url: req.originalUrl + ' forbidden.'
  })
});

console.log('Exordium API. Now running...')
console.log(`https://${process.env.APP_HOSTNAME}:${port}/`);
