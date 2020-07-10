const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let failedLogSchema = new Schema({
    person: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        },
    },
    reason: {
        type: String
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
    collection: 'log_failed'
})

module.exports = mongoose.model('FailedLog', failedLogSchema)