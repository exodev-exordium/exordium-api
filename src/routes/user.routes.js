const dotenv = require('dotenv');
const express = require("express");
const Request = require("request");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const userSchema = require("../models/User");
const authorize = require("../middleware/auth");
const { check, validationResult } = require('express-validator');

// Grab the .env configuration
dotenv.config();

// Basic User Data
router.route('/me/basic').get(authorize, (req, res, next) => {
    try {
        userSchema.findOne({
            _id: req.id,
            email: req.email
        }, { // what fields do we not want to send?
            password: false, 
            registration: false,
            updated: false,
            tokens: false
        }, (error, response) => { // error or reply?
            if (error) {
                return next(error)
            } else {
                res.status(200).json({
                    status: "success",
                    response
                })
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            status: "error",
            message: "Authentication failed"
        });
    }
});

// Basic User Data
router.route('/me/advanced').get(authorize, (req, res, next) => {
    try {
        userSchema.findOne({
            _id: req.id,
            email: req.email
        }, { // what fields do we not want to send?
            password: false, 
            tokens: false
        }, (error, response) => { // error or reply?
            if (error) {
                return next(error)
            } else {
                res.status(200).json({
                    status: "success",
                    response
                })
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            status: "error",
            message: "Authentication failed"
        });
    }
});

// User Tokens
router.route('/me/tokens').get(authorize, (req, res, next) => {
    try {
        userSchema.findOne({
            _id: req.id,
            email: req.email
        }).select('tokens', (error, response) => { // error or reply?
            if (error) {
                return next(error)
            } else {
                res.status(200).json({
                    status: "success",
                    response
                })
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            status: "error",
            message: "Authentication failed"
        });
    }
});

// Discord Connection
router.route('/me/connection/discord').get(authorize, (req, res, next) => {

});

// Github Connection
router.route('/me/connection/github').get(authorize, (req, res, next) => {

});

/*
// Get Single User
router.route('/user/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

// Update User
router.route('/user/:id').put((req, res, next) => {
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User successfully updated!')
        }
    })
})
// Delete User
router.route('/user/:id').delete((req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

*/

module.exports = router;