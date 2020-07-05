const dotenv = require('dotenv');

// Grab the .env configuration
dotenv.config();

// Variables
var recaptchaApi = "https://www.google.com/recaptcha/api/siteverify?";
var recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

module.exports = {
    recaptchaApi: recaptchaApi,
    recaptchaSecret: recaptchaSecret
}