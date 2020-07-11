const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const blogSchema = require('../../models/Blog');

// Grab the .env configuration
dotenv.config();

// Get Last Blogs
router.route('/').get((req, res, next) => {
    try {
        blogSchema.find({}, { // what fields do we not want to send?
            updated: false
        }, (error, response) => { // error or reply?
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
});

// Get Last Blogs
router.route('/:id').get((req, res, next) => {
    try {
        blogSchema.findOne({
            url: req.params.url
        }, { // what fields do we not want to send?
            updated: false
        }, (error, response) => { // error or reply?
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
});

module.exports = router;