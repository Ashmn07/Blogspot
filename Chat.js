const { Schema, model } = require("mongoose")

const Chat = new Schema({
  _id: String,
  messages:[
    {
        username:String,
        userid:String,
        message:String,
    }
  ]
})

module.exports = model("Chat", Chat)