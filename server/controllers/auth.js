const AWS = require('aws-sdk')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { registerEmailParams, forgotPasswordEmailParams } = require('../helpers/email')
const shortId = require('shortid')
const expressJWT = require('express-jwt')
const _ = require('lodash')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
})

const ses = new AWS.SES({ apiVersion: '2010-12-01' })
exports.register = async (req, res) => {
    const { name, password, email } = req.body
    // check if user exisits
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                error: 'Email already exists'
            })
        }
        // generate token using email and password
        const token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '5m'
        })
        const params = registerEmailParams(name, email, token)
        const data = await ses.sendEmail(params).promise()
        console.log(`Email sent thru SES: ${JSON.stringify(data)}`)
        res.json({
            message: `Verification link has been sent to ${email}. Please verify your email address.`
        })
    } catch (err) {
        console.log(`Server caught error...`)
        console.log(err)
        res.json({
            message: 'We could not register this account at the moment. Please try it again shortly'
        })
    }
}

exports.registerActivate = async (req, res) => {
    try {
        // verify token from body
        const { token } = req.body
        const decode = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION)
        // decode
        const { name, email, password } = jwt.decode(token)
        const username = shortId.generate()
        // Save
        const user = await User.findOne({ email })
        if (user) throw new Error('Email is already registered.')
        const newUser = new User({username, name, email, password})
        await newUser.save()
        return res.json({
            message: 'Registered successfully'
        })
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(401).json({
                error: 'This link is expired. Please verify your account again.'
            })
        }
        return res.status(401).json({
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error('User not found')
        if (!user.authenticate(password)) throw new Error('Password not match')
        // generate token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: '30d'})
        return res.json({
            token,
            user: {_id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            error: 'Invalid email or password'
        })
    }
}

exports.requireSignin = expressJWT({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }) // req.user._id

exports.authMiddleware = async (req, res, next) => {
    try {
        const authUserId = req.user._id
        const user = await User.findOne({ _id: authUserId })
        if (!user) throw new Error('User not found')
        req.profile = user
        next()
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.adminMiddleware = async (req, res, next) => {
    try {
        const authUserId = req.user._id
        const user = await User.findOne({ _id: authUserId })
        if (!user) throw new Error('User not found')
        if (user.role !== 'admin') throw new Error('User is not admin')
        req.profile = user
        next()
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new Error(`Email ${email} does not exist.`)

        const token = jwt.sign({ name: user.name }, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})
        const params = forgotPasswordEmailParams(email, token)
        await user.updateOne({resetPasswordLink: token})
        const data = await ses.sendEmail(params).promise()
        console.log(`Email is successfully sent ${data}`)
        return res.json({
            message: `Reset password email is sent to ${email}`
        })
    } catch (error) {
        res.status(400).json({
            error: error.message.includes('does not exist') ? error.message : 'Cannot reset the password at the moment. Please try it again later'
        })
    }
    
    
}

exports.resetPassword = async (req, res) => {
    try {
        const {resetPasswordLink, newPassword} = req.body
        if (resetPasswordLink) {
            const decode = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD)
    
            let user = await User.findOne({resetPasswordLink})
            if (!user) throw new Error('User not found with this reset password link')
            const updatedFields = {
                password: newPassword,
                resetPasswordLink: ''
            }
            user = _.extend(user, updatedFields)
            await user.save()
            return res.json({
                message: 'Your password is reset successfully.'
            })
        }
    } catch (error) {
        console.log(error.message)
        if (error.message === 'jwt expired') {
            return res.status(400).json({
                error: 'This link is expired. Please try it again.'
            })
        }
        return res.status(400).json({
            error: 'Cannot reset your password at the moment. Please try it again'
        })
    }

}