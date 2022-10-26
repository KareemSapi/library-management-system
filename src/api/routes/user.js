

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

router.get('/:id', userController.user_detail)

// GET request for list of all Users.
router.get("/", userController.user_list);

// GET request to delete User.
router.get("/:id/delete", userController.user_delete_get);

// POST request to delete User.
router.post("/:id/delete",userController.user_delete_post);

// GET request to update User.
router.get("/:id/update", userController.user_update_get);

// POST request to update User.
router.post("/:id/update", userController.user_update_post);


module.exports = router