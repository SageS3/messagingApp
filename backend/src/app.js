const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const conversationRoutes = require('./routes/conversationRoutes')
const messageRoutes = require('./routes/messageRoutes')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// routes must be defined after middleware functions
app.use(conversationRoutes);
app.use(messageRoutes);
if(process.env.NODE_ENV !== 'production'){
  dotenv.config()
}
const CONNECTION = process.env.CONNECTION
const PORT = process.env.PORT || 3000
mongoose.set('strictQuery', false)
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


