const mongoose = require('mongoose')
// this code allows to model data 
const conversationSchema = new mongoose.Schema({ 
  time:time,
  members:[String],
  messages:[ 
    {
      sender:String, 
      message:String, 
      timestamp:time
    }
  ],
  totalMessages:Number
});
// exporting the model allows for use across files
module.exports = mongoose.model('Conversation', conversationSchema)