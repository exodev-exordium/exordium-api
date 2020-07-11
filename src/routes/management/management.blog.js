const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();
const Request = require("request");
const { check, validationResult } = require('express-validator');

const blogSchema = require('../../models/Blog');
const authorize = require("../../middleware/auth");
const checkAccessPage = require("../../variables/check-access");

// Grab the .env configuration
dotenv.config();

// Recaptcha
const { recaptchaApi, recaptchaSecret } = require('../../variables/recaptcha');

// Get Blogs
router.route('/').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'blogs-overview')) {
        blogSchema.find((error, response) => {
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
});

// Get specific blog
router.route('/:id').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'blogs-overview')) {
        blogSchema.findOne({
            url: req.params.url
        }, (error, response) => {
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
});

// Add new blog post
router.route('/add').post([
    authorize,
    check('title', 'Title must be provided!')
        .not()
        .isEmpty(),
    check('body', 'Body must be provided!')
        .not()
        .isEmpty(),
    check('url', 'URL must be provided')
        .not()
        .isEmpty()
], (req, res, next) => {
    // Were there errors during checks?
    const errors = validationResult(req);

    // What is our current IP?
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Did we have issues? otherwise we continue...
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {

        // Check and make sure the Recaptcha is correct.
        var checkRecaptcha = `${recaptchaApi}secret=${recaptchaSecret}&response=${req.body.recaptcha}&remoteip=${ipAddress}`;

        Request(checkRecaptcha, function(error, resp, body) {
            if (body.success !== undefined && !body.success) {
                return res.status(422).jsonp({"status": "error", "message": "Captcha Validation failed"});
            } else {
                const post = new blogSchema({
                    title: req.body.title,
                    body: req.body.body,
                    url: req.body.url,
                    created: {
                        person: req.id,
                        createdAt: new Date().now
                    }
                });

                post.save().then((response) => {
                    res.status(201).json({
                        status: "success",
                        message: "Post has been successfully created!",
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        status: "error",
                        error: error
                    });
                });
            }
        });
        
    }
});

module.exports = router;