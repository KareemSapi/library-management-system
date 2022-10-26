

const express = require('express');
const router = express.Router();
const passport = require('passport');
const book_feedback_controller = require('../controllers/book-feedbackController');

//like a book
router.post('/like', book_feedback_controller.like_create_post);

//comment on a book
router.post('/comment', book_feedback_controller.comment_create_post);

//mark/unmark book from favourites
router.post('/mark', book_feedback_controller.favourite_create_post);

module.exports = router;