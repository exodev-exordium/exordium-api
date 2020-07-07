const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const userSchema = require("../models/User");
const authorize = require("../middleware/auth");

// Grab the .env configuration
dotenv.config();

// Get Users
router.route('/').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'page', 'users-overview')) {
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

// Get Single User
router.route('/:id').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'page', 'users-edit')) {
        userSchema.findById(req.params.id, (error, response) => {
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