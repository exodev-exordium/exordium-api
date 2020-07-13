const dotenv = require('dotenv');
const express = require("express");
const router = express.Router();

const blogSchema = require('../../models/Blog');

// Grab the .env configuration
dotenv.config();

// Get Last Blogs
router.route('/').get((req, res, next) => {
    try {

        /*

        https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
        https://stackoverflow.com/questions/38799395/get-data-from-multiple-collections-in-mongoose
        https://stackoverflow.com/questions/35583569/mongodb-aggregation-with-lookup-limit-some-fields-to-return-from-query
        https://mongoosejs.com/docs/populate.html
        https://stackoverflow.com/questions/36805784/how-to-join-two-collections-in-mongoose

        blogSchema.aggregate([{
            $lookup: {
                from: "blog", // collection name in db
                localField: "_id",
                foreignField: "student",
                as: "worksnapsTimeEntries"
            }
        }]).exec(function(err, students) {
            // students contain WorksnapsTimeEntries
        });

        */
        
        blogSchema.find({
            // find everything
        }, { 
            updated: false //remove updated information
        }, (error, response) => {
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