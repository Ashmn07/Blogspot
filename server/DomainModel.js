const { Schema, model } = require("mongoose")

const Domain = new Schema({
  domainId: String,
  description: String,
  domainName: String,
  domainPic: String,
  users: Array
})

module.exports = model("Domain", Domain)