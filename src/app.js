const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const app = express()
const Conversation = require('./models/conversation')
const Message = require('./models/message')

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

app.post('/api/conversations/:id/messages', async (req, res) => { 
  try{ 
    const conversation = await Conversation.findById(req.params.id)
    if(!conversation) { 
      res.status(404).json({error: "conversation not found"})
    }
    conversation.messages.push(req.body)
    conversation.totalMessages += 1
    await conversation.save();
    res.status(200).json({ message: 'Message added to conversation', conversation });
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

app.post('/api/conversations', async (req,res) => {
  const conversation = new Conversation(req.body) 
  try{ 
    await conversation.save()
    res.status(201).json(conversation)
    console.log(conversation)
  }catch(err){ 
    res.status(400).json({error:err})
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


