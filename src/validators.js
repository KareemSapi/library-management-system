

const { check, validationResult }  = require('express-validator');

exports.validate = (method) => {

    switch(method){
        case "register_user": {
            return [
                check('name', 'Name doesn\'t exist').exists(),
                check('email', 'Invalid email').exists().isEmail().trim(),
                check('password').trim().isLength({min: 8}),
                check('confirm_password').trim(),
            ]
        }
    }
}