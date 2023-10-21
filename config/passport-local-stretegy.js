const passport = require('passport');
const Localstrategy = require('passport-local').Strategy;
const User = require('../models/user')

//Authentication with passport.js
passport.use(new Localstrategy(
    {
        usernameField: 'email',
        passReqToCallback:true
    },
    async function (req,email, password, done) {
        //find user and establish the identity
        try {
            const user = await User.findOne({ email: email });
            if (!user || user.password != password) {
                req.flash('error', 'Invalid UserName/Password');
                console.log('Invalid Username/Password');
                done(null, false);
            }
            return done(null, user);
            
        } catch (err) {
            req.flash('error',err);
            console.log('Error in find user');
            return;
        }
    }
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    //encrypted form to store in cookies
    done(null, user.id);
});

// deserializing the user from the cookies
passport.deserializeUser(async function (id, done) {
    //to find decrypted form to find username
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.log('Error');
        return done(null);
    }
});

//Check if the user is Authenticated
passport.checkAuthentication = function (req, res, next) {
    //If the user is signed in , then pass on the req to the function(controller'sfunction)
    if (req.isAuthenticated()) {
        return next();
    }
    //If the user is not signed in
    return res.redirect('sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user is contains the current signed in user from the session cookie and we are just sending this to the locals for the view
        res.locals.user = req.user;
    }
    next();

}

module.exports = passport;

