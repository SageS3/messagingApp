const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')
// defined routes for messages
router.post('/api/conversations/:id/messages', messageController.createMessage )
router.get('/api/conversations/:conversationId/messages', messageController.getAllMessages)
router.delete('/api/conversations/:conversationId/messages/:messageId', messageController.deleteMessage)
module.exports = router