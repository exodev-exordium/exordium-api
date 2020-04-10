const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// Management Page Permission Schema
let aceessPagesPermission = new Schema({
    page: {
        type: String,
        lowercase: true
    }
})

// Multiple Login Tokens Schema
let accessToken = new Schema({
    token: {
        type: String
    },
    generated: {
        type: Date,
    },
    expired: {
        type: Date,
        default: Date.now
    },
    session: {
        os: {
            type: String,
            lowercase: true
        },
        browser: {
            type: String,
            lowercase: true
        },
        location: {
            country: {
                code: {
                    Type: String
                },
                name: {
                    Type: String
                }
            },
            ipAddress: {
                type: String
            }
        }
    },
    permission: {
        type: Boolean,
        default: false
    }
})

// User Data Schema
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
        enum: ['User', 'Subscriber', 'Beta Tester', 'Community Supporter', 'Moderator', 'Administrator', 'Developer'],
        default: 'User'
    },
    access: {
        role: {
            type: String,
            lowercase: true,
            enum: ['user', 'subscriber', 'beta', 'supporter', 'moderator', 'administrator', 'developer'],
            default: 'user'
        },
        pages: [aceessPagesPermission]
    },
    tokens: [accessToken]
    
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { 
    message: 'Email already in use.' 
});

module.exports = mongoose.model('User', userSchema)
