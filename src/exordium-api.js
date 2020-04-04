/*

Exordium API
Author: FearGannicus <contact@exordium.dev> (https://exordium.dev)
Date: 2020-03-16

*/

// Modules
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Grab the .env configuration
dotenv.config();

// Require Database Connection
const dbConfig = require('./database/db');

// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
    }
)

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);

// Setup the server
const app = express();
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// Serve Static Resources
app.use('/public', express.static('public'));

// Require Routers
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

// Create server on the PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Exordium API. Now running...')
  console.log(`https://${process.env.APP_HOSTNAME}:${port}/`);
});

// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
      next(new Error('Something went wrong'));
  });
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  res.status(err.statusCode).send(err.message);
});
