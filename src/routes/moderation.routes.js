const dotenv = require('dotenv');
const express = require("express");
const Request = require("request");
const jwt = require("jsonwebtoken");
const router = express.Router();
const contactSchema = require('../models/Contact');
const userSchema = require("../models/User");
const authorize = require("../middleware/auth");
const { check, validationResult } = require('express-validator');

// Grab the .env configuration
dotenv.config();

// Get Contact Emails
router.route('/contact').get(authorize, (req, res) => {
    if (checkAccessPage(req.access.pages, 'page', 'contact')) {
        contactSchema.find((error, response) => {
            if (error) {
                return next(error)
            } else {
                res.status(200).json(response)
            }
        })
    } else {
        res.status(401).json({ 
            status: "error", 
            message: "Not authorized to access this resource" 
        });
    }
})

// Get Users
router.route('/users').get(authorize, (req, res) => {
    if (checkAccessPage(req.access.pages, 'page', 'users')) {
        userSchema.find((error, response) => {
            if (error) {
                return next(error)
            } else {
                res.status(200).json(response)
            }
        })
    } else {
        res.status(401).json({ 
            status: "error", 
            message: "Not authorized to access this resource" 
        });
    }
})

function checkAccessPage (array, key, value) {
    return array.some(object => object[key] === value);
}

module.exports = router;