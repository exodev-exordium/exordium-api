const dotenv = require('dotenv');
const express = require("express");
const Request = require("request");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const userSchema = require("../models/User");

// Grab the .env configuration
dotenv.config();

// Recaptcha
const { recaptchaApi, recaptchaSecret } = require('../variables/recpatcha.js');

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

            var checkRecaptcha = `${recaptchaApi}secret=${recaptchaSecret}&response=${req.body.recaptcha}&remoteip=${ipAddress}`;
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
    }
);

// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var URLAddress = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`[${ipAddress}] | URL: ${URLAddress}`);

    var checkRecaptcha = `${recaptchaApi}secret=${recaptchaSecret}&response=${req.body.recaptcha}&remoteip=${ipAddress}`;
    Request(checkRecaptcha, function(error, resp, body) {

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
                _id: getUser._id,
                username: getUser.username
            });
        }).catch(err => {
            return res.status(401).json({
                status: "error",
                message: "Authentication failed"
            });
        });    

    });

});

module.exports = router;