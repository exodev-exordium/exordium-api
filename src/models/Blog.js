const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    url: {
        type: String,
        lowercase: true,
        required: true
    },
    cover: {
        type: String,
        default: null
    },
    colour: {
        type: String,
        default: null
    },
    type: {
        type: String,
        lowercase: true,
        enum: ['devblog', 'development', 'update', 'blog'],
        default: 'development',
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    updated: {
        person: {
            type: mongoose.ObjectId,
        },
        updatedAt: {
            type: Date
        }
    },
    created: {
        person: {
            type: mongoose.ObjectId,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        }
    }
}, {
    collection: 'blog'
});

module.exports = mongoose.model('Blog', blogSchema);