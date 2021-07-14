const { Schema, model } = require("mongoose")

const User = new Schema({
  name:String,
  email:String,
  password:String,
  domains:Array,
  documents:Array
  // [{ 
  //   type:Schema.Types.ObjectId,
  //   ref:"Document"
  // }]
})

module.exports = model("User", User)