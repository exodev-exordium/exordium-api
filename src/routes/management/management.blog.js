const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const blogSchema = require('../../models/Blog');
const authorize = require("../../middleware/auth");
const checkAccessPage = require("../../variables/check-access");

// Grab the .env configuration
dotenv.config();



module.exports = router;