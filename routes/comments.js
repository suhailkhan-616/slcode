const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentControllers = require('../controllers/comment_controller');

router.post('/create',passport.checkAuthentication,commentControllers.create);
router.get('/destroy/:id',passport.checkAuthentication,commentControllers.destroyComment);

module.exports = router;