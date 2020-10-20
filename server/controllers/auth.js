const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION
})

const ses = new AWS.SES({ apiVersion: '2010-12-01' })
exports.register = async (req, res) => {
    const { name, password, email } = req.body
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<html><body><h1>Hello ${name}</h1><p>Test email</p></body></html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        },
    }

    try {
        const data = await ses.sendEmail(params).promise()
        if (data) {
            console.log(`Email sent thru SES: ${data}`)
            res.send(`Email sccuessfully sent`)
        } else {
            res.send('email sent failed with no data')
        }
    } catch(err) {
        console.log(`Email sent failed ${err}`)
        res.send('email sent failed')
    }
    
}
