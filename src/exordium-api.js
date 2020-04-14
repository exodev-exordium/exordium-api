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
    console.log('Mongodb: Connected')
  },
  error => {
    console.log("Mongodb: Database can't be connected: " + error)
  }
)

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);

// Setup the server
const app = express();
app.use(express.json());
app.use(cors());

// Contact Router
const publicRouter = require('./routes/public.routes');
app.use('/public', publicRouter);

// Auth Router
const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

// User Router
const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);

// Moderation Router
const moderationRouter = require('./routes/moderation.routes');
app.use('/moderation', moderationRouter);

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
