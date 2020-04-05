const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

// Grab the .env configuration
dotenv.config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.APP_JWTKEY);
        next();
    } catch (error) {
        res.status(401).json({ message: "No token provided" });
    }
};