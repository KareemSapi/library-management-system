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
 const bcrypt = require('bcrypt');
 const config = require('config');
 const secret = config.get('auth.jwt.secret');
 
 passport.use(
    new LocalStrategy( (username, password, done) => {console.log(username, password)
        //Match user
        User.findOne({ email: username })
          .then(user => { console.log(user)
              if(!user){
                  return done(null, false, {message: 'Email or Password is wrong'});
              }
              //Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if(err) throw err;

                  if(isMatch){
                      return done(null, {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                      });
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
 