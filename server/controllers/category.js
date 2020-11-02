const Category = require('../models/Category')
const slugify = require('slugify')
const formidable = require('formidable')
const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')
const fs = require('fs')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION 
})

// exports.create = async (req, res) => {
//     try {
//         const { name, content } = req.body
//         const slug = slugify(name)
//         const image = {
//             url: 'https://via.placeholder.com/350x150.png',
//             key: 'test'
//         }
    
//         const category = new Category({name, slug, image, content})
//         category.postedBy = req.user._id
//         const data = await category.save()
//         return res.json(data)
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({
//             error: 'Cannot Create this category.'
//         })
//     }
// }

exports.create = (req, res) => {
    const { name, image, content } = req.body;
    console.log({ name, image, content });
    // image data
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const type = image.split(';')[0].split('/')[1];
    
    const slug = slugify(name);
    let category = new Category({ name, content, slug });

    const params = {
        Bucket: 'tech4tech-img',
        Key: `category/${uuid()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).json({ error: 'Upload to s3 failed' });
        }
        console.log('AWS UPLOAD RES DATA', data);
        category.image.url = data.Location;
        category.image.key = data.Key;

        // save to db
        category.save((err, success) => {
            if (err) {
                console.log(err);
                res.status(400).json({ error: 'Duplicate category' });
            }
            return res.json(success);
        });
    });
};

exports.list = async (req, res) => {
    try {
        const categories = await Category.find({})
        if (!categories) throw new Error('Cannot list categories')
        res.json(categories)
    } catch (err) {
        console.log(err.message)
        res.status(400).json({
            error: 'Cannot list categories'
        })
    }
}

exports.read = (req, res) => {

}

exports.update = (req, res) => {

}

exports.remove = (req, res) => {

}