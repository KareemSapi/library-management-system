

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/:id', userController.get_user)

router.delete('/:id', userController.delete_user);

module.exports = router