//Step-2
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/users', require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./like'));


// APIs
router.use('/api', require('./api'));

console.log('Router loaded in express file')
module.exports = router;