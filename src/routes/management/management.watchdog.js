const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const contactSchema = require('../../models/Contact');
const authorize = require("../../middleware/auth");
const checkAccessPage = require("../../variables/check-access");

// Grab the .env configuration
dotenv.config();



module.exports = router;