

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { validate } = require('../../validators')

//GET user registration page
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', validate('register_user'), authController.register);

//GET login page
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router