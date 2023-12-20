const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getAllMesssageController, sendMessageController } = require('../controller/messageController ');

router.post('/',protect,sendMessageController)
router.get('/:chatId', protect, getAllMesssageController)

module.exports = router;