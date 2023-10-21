//Optional Step-2
const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/user_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.signUP);

//Create
router.post('/create', userController.create);

//use passport as a middlewear to authentication
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' },
), userController.createSession);
router.get('/sign-out', userController.destroySession);
//It is use for Manual Authentication
//router.post('/create-session', userController.createSession);

// google oauth config for google authenticate
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/sign-in' }), userController.createSession);

// forget password
router.post('/reset', userController.resetPassword);

router.get('/forget', userController.forgetRender);

router.post('/reset-password', userController.newPassword);

router.get('/reset-password', userController.updatePassword);

router.post('/friendship', userController.friendShip);

router.post('/friendship_destroy', userController.friendshipDestroy);

// router.get('/friends',userController.friendRender);

module.exports = router;
