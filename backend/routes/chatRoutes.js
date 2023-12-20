const express = require('express');
const { accessChatController, fetchChatController, createGroupChatController, renameGroupChatController, addToGroupGroupChatController, removeFromGroupGroupChatController } = require('../controller/chatController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/create',protect, accessChatController)
router.get('/chat',protect, fetchChatController)
router.post('/create-group',protect,createGroupChatController)
router.put('/rename-group',renameGroupChatController)
router.put('/add-to-group',addToGroupGroupChatController)
router.put('/remove-from-group',removeFromGroupGroupChatController)

module.exports = router;