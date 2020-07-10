const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let contactSchema = new Schema({
    person: {
        realname: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        },
        phone: {
            type: String
        }
    },
    company: {
        type: String
    },
    message: {
        type: String
    },
    created: {
        ipAddress: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    collection: 'contact'
});

module.exports = mongoose.model('Contact', contactSchema);
