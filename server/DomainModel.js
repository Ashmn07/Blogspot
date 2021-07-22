const { Schema, model } = require("mongoose")

const Domain = new Schema({
  domainId: String,
  description: String,
  domainName: String,
  domainPic: String,
  documents:Array,
  users: [{
      type:Schema.Types.ObjectId,
      ref:"User"
  }]
})

module.exports = model("Domain", Domain)