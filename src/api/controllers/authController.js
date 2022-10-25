

const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');


// exports.register = async (req, res) => {
//     const { name, email, password, password2} = req.body;
//     let errors = [];

//     //Check required fields
//     if(!name || !email || !password || !password2 ){
//         errors.push({msg: 'Please fill in all fields'});
//     }

//     //Check passwords match
//     if(password !== password2){
//         errors.push({msg: 'Passwords do not match'});
//     }

//     //Check password length
//     if(password.length < 6){
//         errors.push({msg: 'Password should be at least 6 characters long'});
//     }

//     if(errors.length > 0){
//         res.render('register', {
//             errors,
//             name,
//             email,
//             password,
//             password2
//         });
//     }
//     else{
//         //Validation passed
//         User.findOne({ email: email})
//            .then(user => {
//                if(user){
//                    //If user exists
//                    errors.push({msg: 'email already exists.'})
//                    res.render('register', {
//                     errors,
//                     name,
//                     email,
//                     password,
//                     password2
//                 });
//                }
//                else{
//                    const newUser = new User({
//                        name,
//                        email,
//                        password,
//                    });

//                    //Hash password
//                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
//                        if(err) throw err;

//                        //set password to hashed
//                        newUser.password = hash;

//                        //save user
//                        newUser.save()
//                          .then(user => {
//                             req.flash('success_msg', 'You are now registered') 
//                             res.redirect('/users/login')})
//                          .catch(err => console.log(err));
//                    }))
//                    console.log(newUser);
                
//                }
//            })
//     }
// }

exports.login = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req, res, next);
}

exports.logout = (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}

exports.register = async (req, res) => { console.log(req.body)
    try {
        const USER = await User.findOne({email: req.body.email})
        console.log(USER)
        
  
        if(req.body.password !== req.body.confirm_password){
          return res.status(400).json({message: `passwords do not match`})
        }
  
        if(USER){
            return res.status(400).json({message: `User already exists`})
        }

        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(req.body.password, salt, async(err, hash) => {
            if(err) throw err;

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: 'user',
            })

            console.log(hash);

        }))
  
        return res.status(201).json({message: `User succesfully created`})
  
      } catch (error) {
          console.error(error);
          return res.status(400).json({message: 'Something went wrong!!!'})
      }
}