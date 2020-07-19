const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();
const Request = require("request");
const { check, validationResult } = require('express-validator');

const blogSchema = require('../../models/Blog');
const authorize = require("../../middleware/auth");
const checkAccessPage = require("../../variables/check-access");

const upload = require('../../middleware/multerFiles');

// Grab the .env configuration
dotenv.config();

// Recaptcha
const { recaptchaApi, recaptchaSecret } = require('../../variables/recaptcha');
const { generateColour } = require('../../variables/colour');
//const { announcementSend } = require('../../middleware/discordSend');

// Get Blogs
router.route('/').get(authorize, (req, res, next) => {
    if (checkAccessPage(req.access.pages, 'blogs-overview')) {

        try {

            blogSchema.aggregate([
                {
                    "$lookup": {
                        "from": "users", // collection name in db
                        "localField": "created.person",
                        "foreignField": "_id",
                        "as": "author"
                    }
                }, {
                    "$unwind": "$author"
                }, {
                    "$project": {
                        "_id": 1,
                        "title": 1,
                        "body": 1,
                        "url": 1,
                        "disabled": 1,
                        "created": 1,
                        "author.username": 1,
                        "author.title": 1
                    }
                }
            ], (error, response) => {
                if (error) {
                    return next(error)
                } else {
                    res.status(200).json(response)
                }
            }).sort({
                _id: -1
            }).limit(5);

        } catch (err) {
            console.error(err);
            return res.status(200).json({
                status: "error",
                message: "No blogs were found"
            });
        }

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

        try {

            blogSchema.aggregate([
                {
                    "$match": {
                        "url": req.params.id
                    }
                }, {
                    "$lookup": {
                        "from": "users", // collection name in db
                        "localField": "created.person",
                        "foreignField": "_id",
                        "as": "author"
                    }
                }, {
                    "$unwind": "$author"
                }, {
                    "$project": {
                        "_id": 1,
                        "title": 1,
                        "body": 1,
                        "url": 1,
                        "disabled": 1,
                        "created": 1,
                        "author.username": 1,
                        "author.title": 1
                    }
                }
            ], (error, response) => {
                if (error) {
                    return next(error)
                } else {
                    res.status(200).json(response)
                }
            }).sort({
                _id: -1
            }).limit(5);

        } catch (err) {
            return res.status(200).json({
                status: "error",
                message: "No blogs were found"
            });
        }

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
    upload.single('cover'),
], (req, res, next) => {
    // Were there errors during checks?
    const errors = validationResult(req);

    // Did we have issues? otherwise we continue...
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {

        // Check and make sure the Recaptcha is correct.
        const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var checkRecaptcha = `${recaptchaApi}secret=${recaptchaSecret}&response=${req.body.recaptcha}&remoteip=${ipAddress}`;

        Request(checkRecaptcha, function(error, resp, body) {
            if (body.success !== undefined && !body.success) {
                return res.status(422).jsonp({"status": "error", "message": "Captcha Validation failed"});
            } else {

                // just make it null
                var filename;
                if (!req.file) {
                    filename = null;
                } else {
                    filename = req.file.filename;
                }

                const post = new blogSchema({
                    title: req.body.title,
                    body: req.body.body,
                    url: req.body.url,
                    type: req.body.type,
                    cover: filename,
                    colour: generateColour(),
                    created: {
                        person: req.id,
                        createdAt: Date.now()
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