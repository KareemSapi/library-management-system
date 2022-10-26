

const BookLike = require('../models/Book_Like');
const BookComment = require('../models/Book_Comment');
const BookFavourite = require('../models/Book_Favourite');
const async = require('async');
const { body, validationResult } = require('express-validator')

exports.like_create_post = async (req, res, next) => {

    try {
        let LIKE = await BookLike.findOne({user_id: req.user.id, book_id: req.body.id})

        if(LIKE){ return LIKE}

        await BookLike.create({
            user_id: req.user.id,
            book_id: req.body.id
        })

        return res.status(200).send('you liked the book')
    } catch (error) {
        console.log(error)
    }
}

exports.comment_create_post = async (req, res, next) => {

    try {
        let COMMENT = await BookComment.findOne({user_id: req.user.id, book_id: req.body.id})

        if(COMMENT){ return COMMENT; }

        await BookComment.create({
            comment: req.body.comment,
            user_id: req.user.id,
            book_id: req.body.id
        })

        return res.status(200).send('you commented on the book')
    } catch (error) {
        console.log(error)
    }
}

exports.favourite_create_post = async (req, res, next) => {

    try {
        let FAVOURITE = await BookFavourite.findOne({user_id: req.user.id, book_id: req.body.id})

        if(FAVOURITE){ 
            FAVOURITE.deleteOne();

            return res.status(200).send('Book has been unmarked!')
        }

        await BookFavourite.create({
            user_id: req.user.id,
            book_id: req.body.id
        })
    } catch (error) {
        console.log(error)
    }
}