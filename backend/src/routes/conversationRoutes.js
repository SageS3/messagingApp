const express = require('express')
const router = express.Router()
const conversationController = require('../controllers/conversationController')
// conversation routes
router.post('/api/conversations', conversationController.createConversation)
router.get('/api/conversations', conversationController.getAllConversations)
router.get('/api/conversations/:id', conversationController.getConversationById)
router.delete('/api/conversations/:id', conversationController.deleteConversationById)
router.delete('/api/conversations/:conversationId/members/:memberName', conversationController.deleteMember)
router.get('/api/conversations/:id/members', conversationController.getAllMembers)

module.exports = router