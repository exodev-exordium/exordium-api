const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    url: {
        type: String,
        lowercase: true
    },
    disabled: {
        type: Boolean
    },
    updated: {
        person: {
            type: String,
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    created: {
        person: {
            type: String,
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