const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
    header: {
        title: {
            type: String
        },
        subtitle: {
            type: String
        }
    },
    body: {
        short: {
            type: String
        },
        long: {
            type: String
        }
    },
    url: {
        type: String,
        lowercase: true
    },
    updated: {
        person: {
            id: {
                type: String,
            },
            email: {
                type: String,
                lowercase: true
            },
        },
        ipAddress: {
            type: String
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    created: {
        person: {
            id: {
                type: String,
            },
            email: {
                type: String,
                lowercase: true
            },
        },
        ipAddress: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    collection: 'blog'
});

module.exports = mongoose.model('Blog', blogSchema);