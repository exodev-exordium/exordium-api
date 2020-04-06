const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const User = require('../models/user');

// Grab the .env configuration
dotenv.config();

module.exports = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, process.env.APP_JWTKEY);
        
        const user = await User.findOne({ _id: data.userId, email: data.email});
        if (!user) {
            throw new Error();
        }

        req.id = data.userId;
        req.email = data.email;
        next();
    } catch (error) {
        res.status(401).json({ status: "error", message: "Not authorized to access this resource" });
    }
};