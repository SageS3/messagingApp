const mongoose = require('mongoose')
const messageSchema = require('../models/message')
// this code allows to model data 
const conversationSchema = new mongoose.Schema({
  time:String,
  members:{type:[String], required:true},
  messages:[messageSchema],
  totalMessages:{type:Number, default:0, required: true}
});

// validator function limits messages array
conversationSchema.path('messages').validate(function(messages) {
  const limit = 20
  return messages.length <= limit;
}, `The number of messages exceeds the limit.`);

// exporting the model allows for use across files
module.exports = mongoose.model('Conversation', conversationSchema, "conversations")