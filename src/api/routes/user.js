

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/:id', userController.user_detail)

// GET request for list of all Users.
router.get("/", userController.user_list);

router.delete('/:id', userController.delete_user);

module.exports = router