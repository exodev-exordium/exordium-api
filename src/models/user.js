const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({

    username: {
        type: String
    },
    email: {
        type: String,
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
            type: String
        },
        ipAddress: {
            type: String
        },
        registeredAt: {
            type: Date
        }
    },
    updated: {
        ipAddress: {
            type: String
        },
        updatedAt: {
            type: Date
        }
    },
    title: {
        type: String,
        default: 'User'
    },
    access: {
        type: String,
        default: 'user'
    }
    
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { 
    message: 'Email already in use.' 
});

module.exports = mongoose.model('User', userSchema)