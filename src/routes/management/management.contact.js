const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const contactSchema = require('../../models/Contact');
const authorize = require("../../middleware/auth");
const checkAccessPage = require("../../variables/check-access");

// Grab the .env configuration
dotenv.config();

// Get Contact Emails
router.route('/').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'contact-overview')) {
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

module.exports = router;