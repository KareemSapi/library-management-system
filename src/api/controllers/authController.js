

const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

// exports.login = async (req, res) => { console.log(req.body);

//     passport.authenticate('local', 
//     {
//         session: false,
//         successRedirect: '/catalog',
//         failureRedirect: '/auth/login',
//         failureFlash: true
//     }, 
//     (err, user) => { console.log(err,user)
//         if(err || !user){
//           return res.status(400).json({message: `Incorrect username or password`})
//         }
        
//         req.login(user, { session: false }, (error) => { 
//               if (error) {
//                   return res.send(error);
//               } 
    
//                 const accessToken = jwt.sign(user, config.get('auth.jwt.secret'), {expiresIn: '1y'}) //create access token
    
//             return res.status(200).json({  accessToken, message: `Login succesful` });
//         });
        
    
//       })(req,res)
// }

exports.logout = (req, res) => {
    //req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
}

exports.register = async (req, res) => { //console.log(req.body)
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).jsonp(errors.array());
    }

    
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

        res.redirect('/auth/login');
  
        //return res.status(201).json({message: `User succesfully created`})
  
      } catch (error) {
          console.error(error);
          return res.status(400).json({message: 'Something went wrong!!!'})
      }
}

exports.login = async (req, res) => { //console.log(req.body)
    try {
        const USER = await User.findOne({email: req.body.email});
      
        if(!USER){ return res.status(400).send('incorrect username or password')}
      
        bcrypt.compare(req.body.password, USER.password, (error, isMatch) => {
          if(error) return console.log(error);
      
          if(isMatch){

            let user = {
                id: USER._id,
                name: USER.name,
                email: USER.email,
                role: USER.role
            } 
            //console.log(user)

            const accessToken = jwt.sign(user, config.get('auth.jwt.secret'), {expiresIn: '1y'})

            res.cookie("accessToken", accessToken, {
                maxAge: 3.156e+10,
                httpOnly: true,
            })

            return res.redirect('/catalog');
          }
        })
  } catch (error) {
        console.error(error)
  }
}