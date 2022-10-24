/**
 * @title
 * Auth configuration
 * 
 * 
 * @lastEdit
 * Oct 24 2022, Kareem Sapi
 */

 const passport = require('passport');
 const LocalStrategy = require('passport-local').Strategy;
 const passportJWT = require('passport-jwt');
 const JWTStrategy = passportJWT.Strategy;
 const ExtractJWT = passportJWT.ExtractJwt;
 
 const User = require('./api/models/User');
 const crypto = require('crypto');
 const bcrypt = require('bcrypt');
 const config = require('config');
 const secret = config.get('auth.jwt.secret');
 
 passport.use(
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
        //Match user
        User.findOne({ email: email })
          .then(user => {
              if(!user){
                  return done(null, false, {message: 'Email or Password is wrong'});
              }
              //Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if(err) throw err;

                  if(isMatch){
                      return done(null, user);
                  }
                  else{
                      return done(null, false, {message: 'Email or Password is wrong'})
                  }
              })
          })
          .catch(err => console.log(err));
    } )
)
 
 /**
  * @method: Authenticate JWT token
  */
 
 passport.use(new JWTStrategy({
     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
     secretOrKey: secret,
   }, 
     function(jwt_payload, done){
        return done(null, jwt_payload)
 }))