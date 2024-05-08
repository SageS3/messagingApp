const mongoose = require('mongoose')
// this code allows to model data 
const conversationSchema = new mongoose.Schema({
  time:String,
  members:[String],
  messages:[ 
    {
      sender:String, 
      message:String, 
      timestamp:String
    }
  ],
  totalMessages:Number
});

// validator function limits messages array
conversationSchema.path('messages').validate(function(messages) {
  const limit = 20
  return messages.length <= limit;
}, `The number of messages exceeds the limit.`);

// exporting the model allows for use across files
module.exports = mongoose.model('Conversation', conversationSchema, "conversations")