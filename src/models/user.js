const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({

    username: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String
    },
    realname: {
        type: String
    },
    picture: {
        type: String
    },
    registration: {
        country: {
            code: {
                type: String
            },
            name: {
                type: String
            }
        },
        ipAddress: {
            type: String
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    updated: {
        ipAddress: {
            type: String
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    title: {
        type: String,
        default: 'User'
    },
    access: {
        type: String,
        lowercase: true,
        default: 'user'
    },
    tokens: {
        token: {
            type: String
        }
    }
    
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { 
    message: 'Email already in use.' 
});

module.exports = mongoose.model('User', userSchema)