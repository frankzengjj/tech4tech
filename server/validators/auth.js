const { check } = require('express-validator')

exports.userRegisterValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name must not be empty!'),
    check('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long!')
]