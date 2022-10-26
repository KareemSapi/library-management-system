
const jwt = require('jsonwebtoken')
const config = require('config')

function deserializeUser(req, res, next){
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
        return next();
    }

    const user =  jwt.verify(accessToken, config.get('jwt.secret'))

    if(user){
        req.user = user;

        return next();
    }
}

module.exports = deserializeUser