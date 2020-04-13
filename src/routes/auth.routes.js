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

// Google Recaptcha Variables
var grecaptcha = "https://www.google.com/recaptcha/api/siteverify?";

// Sign-up
router.post("/register",
    [
        check('username')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage('Name must be atleast 3 characters long'),
        check('email', 'Email is required')
            .not()
            .isEmpty(),
        check('country', 'Country is required')
            .not()
            .isEmpty(),
        check('password', 'Password should be between 5 to 64 characters long')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 64 }),
        check('recaptcha')
            .not()
            .isEmpty()
            .withMessage('Must provide valid recaptcha response')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var URLAddress = req.protocol + '://' + req.get('host') + req.originalUrl;

        console.log(`[${ipAddress}] | URL: ${URLAddress}`);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {

            var checkRecaptcha = `${grecaptcha}secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.recaptcha}&remoteip=${ipAddress}`
            Request(checkRecaptcha, function(error, resp, body) {
                body = JSON.parse(body);

                console.log(`${checkRecaptcha}`);
                console.log(body);

                if (body.success !== undefined && !body.success) {
                    return res.status(422).jsonp({"status": "error", "message": "Captcha Validation failed"});
                } else {
                    bcrypt.hash(req.body.password, 10).then((hash) => {
                        const user = new userSchema({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            realname: req.body.realname || undefined,
                            registration: {
                                country: {
                                    code: req.body.country.code,
                                    name: req.body.country.name
                                },
                                ipAddress: ipAddress,
                                registeredAt: new Date().now
                            },
                            updated: {
                                ipAddress: ipAddress,
                                updatedAt: new Date().now
                            },
                            title: 'User',
                            access: {
                                roles: [
                                    {
                                        role: "user"
                                    }
                                ],
                                pages: []
                            }
                        });
                        user.save().then((response) => {
                            res.status(201).json({
                                status: "success",
                                message: "User successfully created!",
                                result: response
                            });
                        }).catch(error => {
                            res.status(500).json({
                                status: "error",
                                error: error
                            });
                        });
                    });
                }
            });

        }
    });


// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                status: "error",
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, process.env.APP_JWTKEY, {
            expiresIn: "2h"
        });
        res.status(200).json({
            status: "success",
            token: jwtToken,
            expiresIn: 7200,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            status: "error",
            message: "Authentication failed"
        });
    });
});

// Get My User Data
router.route('/user/me').get(authorize, (req, res, next) => {
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var URLAddress = req.protocol + '://' + req.get('host') + req.originalUrl;

    console.log(`[${ipAddress}] | URL: ${URLAddress} | Email: ${req.email}`);

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