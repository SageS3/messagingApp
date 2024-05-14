const Conversation = require('../models/conversation')
// something is wrong here...
exports.createMessage = async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.id)
    if(!conversation) { 
      return res.status(404).json({error: "conversation not found"})
    }
    if(!req.body){ 
      return res.status(404).json({error: "something wrong with req.body"})
    }
    const newMessage = { 
      sender: req.body.sender,
      message: req.body.message,
      timestamp: new Date().toISOString()
    }
    conversation.messages.push(newMessage)
    if(!conversation.members.includes(req.body.sender)){ 
      conversation.members.push(req.body.sender)
    }
    conversation.totalMessages = conversation.messages.length
    conversation.time = new Date().toLocaleTimeString()
    
    await conversation.save();
    return res.status(200).json({ message: 'Message added to conversation', conversation });
  }catch(err){ 
    res.status(500).json({error:err.message})
  }
}

exports.getAllMessages = async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.conversationId)
    if(!conversation){ 
      return res.status(404).json("Conversation not found")
    } 
    return res.json(conversation.messages)
  }catch(err){ 
    res.status(404).json({error:err})
  }
}

exports.deleteMessage = async (req, res) => { 
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    const messageIndex = conversation.messages.findIndex(message => message._id.toString() === req.params.messageId);
    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    conversation.messages.pull(req.params.messageId);
    conversation.totalMessages -= 1
    await conversation.save();
    
    return res.json({ success: true });
  } catch(err) { 
    res.status(500).json({ error: err.message });
  }
}
