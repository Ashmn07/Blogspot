const { Schema, model } = require("mongoose")

const User = new Schema({
  name:String,
  email:String,
  password:String,
  domains:[{ 
    type:Schema.Types.ObjectId,
    ref:"Domain"
  }],
  documents:Array
})

module.exports = model("User", User)