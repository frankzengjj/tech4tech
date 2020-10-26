exports.registerEmailParams = (name, email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                    <body>
                    <h1>Hello ${name},</h1>
                    <p>Please verify your email using the following link:</p>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    </body>
                    </html>
                `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        },
    }
}

exports.forgotPasswordEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { /* required */
            Body: { /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <html>
                    <body>
                    <h3>Hello,</h3>
                    <p>Please reset your password using the following link:</p>
                    <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    </body>
                    </html>
                `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Reset your password'
            }
        },
    }
}
