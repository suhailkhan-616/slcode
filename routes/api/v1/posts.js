const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsApi = require('../../../controllers/api/v1/postsapi');

router.get('/',postsApi.postApi);
router.delete('/:id',passport.authenticate('jwt',{session:false}),postsApi.destroyPost);




module.exports = router;
