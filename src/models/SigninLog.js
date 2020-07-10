const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let signinLogSchema = new Schema({
    person: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        },
    },
    logged: {
        ipAddress: {
            type: String
        },
        loggedAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    collection: 'log_signin'
})

module.exports = mongoose.model('SigninLog', signinLogSchema)