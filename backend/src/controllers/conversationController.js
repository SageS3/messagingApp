const Conversation = require('../models/conversation')

// conversation crud operations
exports.createConversation = async (req, res) => { 
  const conversation = new Conversation(req.body) 
  try{ 
    conversation.time = new Date().toLocaleTimeString()
    await conversation.save()
    res.status(201).json(conversation)
    console.log(conversation)
  }catch(err){ 
    res.status(400).json({error:err})
  }
}

exports.getAllConversations = async (req, res) => { 
  try{ 
    const result = await Conversation.find()
    if(!result){ 
      return res.status(404).json({error:"Conversations not found"})
    } 
    return res.json({conversations: result})
  } catch(err){ 
    res.status(404).json({error:err})
  }
}

exports.getConversationById = async (req, res) => { 
  try{ 
    const result = await Conversation.findById(req.params.id)
    if(result){ 
      res.json(result)
    } else { 
      res.status(404).json({error:"Conversation not found"})
    }
 
  }catch(err){ 
    res.status(400).json({error: err})
  }
}

exports.deleteConversationById = async (req, res) => { 
  try{ 
    const result = await Conversation.deleteOne({_id:req.params.id})
    res.json({deletedCount: result})
  } catch(err){ 
    res.status(404).json({error: err})
  }
}

exports.deleteMember = async (req, res) => { 
  try{ 
    //find conversation
    const conversation = await Conversation.findById(req.params.conversationId)
    //find conversation error handling
    !conversation && res.status(404).json({error:"Conversation not found"})
    //find member index
    const memberIndex = conversation.members.indexOf(req.params.memberName)
    // find member index error handling
    if(memberIndex === -1){ 
      return res.status(404).json({error:"Member not found"})
    }
    // splice member from members array
    conversation.members.splice(memberIndex,1)
    // remove all message sent by memberName
    conversation.messages.pull({sender: req.params.memberName})
    // update totalMessage property
    conversation.totalMessages = conversation.messages.length
    // await save conversation
    await conversation.save()
    // return response if operations succeed
    return res.json({ success: true });
  }catch(err){ 
    // operation failed
    res.status(404).json({error:err})
  }
}

exports.getAllMembers = async (req, res) => { 
  try{
    const conversation = await Conversation.findById(req.params.id)
    if(!conversation){ 
      return res.status(404).json({error:"conversation not found"})
    }
    return res.json({members: conversation.members})
  } catch(err){ 
    return res.status(400).json({error:"something went wrong"})
  }
}