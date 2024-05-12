const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const app = express()
const Conversation = require('./models/conversation')
// const Message = require('./models/message')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
if(process.env.NODE_ENV !== 'production'){ 
  dotenv.config()
}
const CONNECTION = process.env.CONNECTION
const PORT = process.env.PORT || 3000
mongoose.set('strictQuery', false) 

app.delete('/api/conversations/:id', async (req, res) => { 
  try{ 
    const result = await Conversation.deleteOne({_id:req.params.id})
    res.json({deletedCount: result})
  } catch(err){ 
    res.status(404).json({error: err})
  }
})

app.delete('/api/conversations/:conversationId/messages/:messageId', async (req, res) => { 
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
});

app.delete('/api/conversations/:conversationId/members/:memberName', async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.conversationId)
    if(!conversation){ 
      return res.status(404).json({error:"Conversation not found"})
    }

    const memberIndex = conversation.members.indexOf(req.params.memberName)
    if(memberIndex === -1){ 
      return res.status(404).json({error:"Member not found"})
    }
    conversation.members.splice(memberIndex,1)

    // filter messages array, delete all messages with the sender name equal to memberName
    const updatedMessages = conversation.messages.filter((message) => { 
      message.sender !== req.params.memberName // work on
    })
    conversation.messages = updatedMessages // work on
    conversation.totalMessages = conversation.messages.length
    await conversation.save()
    return res.json({ success: true });
  }catch(err){ 
    res.status(404).json({error:err})
  }
})

app.post('/api/conversations', async (req,res) => {
  const conversation = new Conversation(req.body) 
  try{ 
    conversation.time = new Date().toLocaleTimeString()
    await conversation.save()
    res.status(201).json(conversation)
    console.log(conversation)
  }catch(err){ 
    res.status(400).json({error:err})
  }
})

app.post('/api/conversations/:id/messages', async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.id)
    if(!conversation) { 
      res.status(404).json({error: "conversation not found"})
    }
    console.log(req.body)
    conversation.messages.push(req.body)
    conversation.members.push(req.body.sender)
    conversation.totalMessages = conversation.messages.length
    conversation.time = new Date().toLocaleTimeString()
    
    await conversation.save();
    return res.status(200).json({ message: 'Message added to conversation', conversation });
  }catch(err){ 
    res.status(404).json({error:err})
  }
})

app.get('/api/conversations/:id', async (req, res) => { 
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
})

app.get('/api/conversations', async (req, res) => { 
  try{ 
    const result = await Conversation.find()
    if(!result){ 
      return res.status(404).json({error:"Conversations not found"})
    } 
    return res.json({conversations: result})
  } catch(err){ 
    res.status(404).json({error:err})
  }
})

app.get('/api/conversations/:conversationId/messages', async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.conversationId)
    if(!conversation){ 
      return res.status(404).json("Conversation not found")
    } 
    return res.json(conversation.messages)
  }catch(err){ 
    res.status(404).json({error:err})
  }
})

const start = async() => { 
  try{ 
    await mongoose.connect(CONNECTION)
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`)
    })
  } catch(err) { 
    console.log(err.message)
  }
}

start()


