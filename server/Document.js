const { Schema, model } = require("mongoose")

const Document = new Schema({
  _id: String,
  data: Object,
  name:String,
  users:Array
  // [{
  //   type:Schema.Types.ObjectId,
  //   ref:"User"
  // }]
})

module.exports = model("Document", Document)