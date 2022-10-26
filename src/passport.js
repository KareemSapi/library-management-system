/**
 * @title
 * Auth configuration: 
 * 
 * 
 * 
 * 
 * @lastEdit
 * Oct 05 2022, Kareem Sapi
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

passport.use(new LocalStrategy(async (email, password, cb) => {
try {
	  const USER = await User.findOne({email: email});
	
	  if(!USER){ return cb(null, false)}
	
	  bcrypt.compare(password, USER.password, (error, isMatch) => {
	    if(error) return console.log(error);
	
	    if(isMatch){
	      return cb(null, USER)
	    }
	  })
} catch (error) {
	  console.error(error)
}
}))

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