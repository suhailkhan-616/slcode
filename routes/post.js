const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');

router.post('/post',postController.post);

module.exports = router;
