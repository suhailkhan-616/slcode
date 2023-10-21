const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use Stretagy for google login 
passport.use(new googleStrategy({
    clientID: "555442726627-ar2c9d5cobmshi00pvna2ebhus3eoinv.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //find the user
        // find a user
        User.findOne({ email: profile.emails[0].value }).then(function (user) {
            // console.log(profile);
            if (user) {
                // if found, set this user to  req.user
                console.log('User found');
                return done(null, user);
            } else {
                // if  not found , create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                }).then(function (user) {
                    console.log('User created');
                    return done(null, user);
                }).catch(function (err) {
                    console.log('Error in create google ouath'.err);
                });
            }
        }).catch(function (err) {
            console.log('Error in create google ouath'.err);
        });
    }

));

module.exports = passport;
