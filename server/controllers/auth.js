const AWS = require('aws-sdk')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { registerEmailParams } = require('../helpers/email')

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
            expiresIn: '10m'
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
