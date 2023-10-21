const passport = require('passport');
const JWTstretegy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'slcode'
}

passport.use(new JWTstretegy(opts,async function(jwtPayLoad,done){
    console.log(jwtPayLoad._id)
  const user = await User.findById(jwtPayLoad._id);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
}));

module.exports = passport;