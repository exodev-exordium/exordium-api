const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const blogSchema = require('../../models/Blog');
const userSchema = require('../../models/User');

// Grab the .env configuration
dotenv.config();

// Get Last Blogs
router.route('/').get((req, res, next) => {
    try {

        blogSchema.aggregate([
            {
                "$match": {
                    "disabled": false
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
                    "cover": 1,
                    "colour": 1,
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
        }).limit(10);
        
    } catch (err) {
        return res.status(200).json({
            status: "error",
            message: "No blogs were found"
        });
    }
});

// Get Last Blogs
router.route('/:id').get((req, res, next) => {
    try {
        blogSchema.aggregate([
            {
                "$match": {
                    "type": req.params.id,
                    "disabled": false
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
                    "cover": 1,
                    "colour": 1,
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
        }).limit(10);
    } catch (err) {
        return res.status(200).json({
            status: "error",
            message: "No blogs were found"
        });
    }
});

// Get Last Blogs
router.route('/post/:id').get((req, res, next) => {
    try {

        blogSchema.aggregate([
            {
                "$match": {
                    "url": req.params.id,
                    "disabled": false
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
                    "cover": 1,
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
        }).limit(1);

    } catch (err) {
        return res.status(200).json({
            status: "error",
            message: "No blogs were found"
        });
    }
});

// Get Blog Author
router.route('/author/:username/:title').get((req, res, next) => {

    try {
        userSchema.findOne({
            "username": req.params.username.toLowerCase(),
            "title": req.params.title[0].toUpperCase()+req.params.title.slice(1)
        }, {
            "username": 1,
            "title": 1,
        }).then(response => {
            if(!response) {
                return res.status(401).json({
                    status: "error",
                    message: "No author found."
                });
            } else {    
                res.status(200).json(response);
            }
        }).catch(error => {
            return next(error)
        });
    } catch (err) {
        return res.status(200).json({
            status: "error",
            message: "No authors were found"
        });
    }
});


module.exports = router;