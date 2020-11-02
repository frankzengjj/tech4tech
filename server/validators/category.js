const { check } = require('express-validator')

exports.categoryCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Category Name is Required'),
    check('image')
        .not()
        .isEmpty()
        .withMessage('Image is Required'),
    check('content')
        .isLength({ min: 20 })
        .withMessage('Content is Required and need to be 20 characters long')
]

exports.categoryUpdateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Category Name is Required'),
    check('image')
        .isEmpty()
        .withMessage('Image is Required'),
    check('content')
        .isLength({ min: 20 })
        .withMessage('Content is Required and need to be 20 characters long')
]