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
    url: req.originalUrl + ' not found'
  })
});

console.log('RESTful API server started on: ' + port);
