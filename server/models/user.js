const mongoose = require('mongoose');
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        max: 12,
        unique: true,
        index: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    }
}, { timestamps: true })

// virtual fields
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(() => {
        return this._password
    })

userSchema.methods = {
    authenticate: function(plain_pass) {
        return this.encryptPassword(plain_pass) === this.hashed_password
    },

    encryptPassword: function(plain_pass) {
        if (!plain_pass) return 'empty password'
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(plain_pass)
                .digest('hex');
        } catch (err) {
            return 'error encrypting password'
        }
    },

    makeSalt: function() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = mongoose.model('User', userSchema)
