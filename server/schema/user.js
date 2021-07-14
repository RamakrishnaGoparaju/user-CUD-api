const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    emailId:String,
    firstName:String,
    lastName:String,
}, { timestamps: { createdAt: 'createdon', updatedAt: 'updatedon' }, strict: true });
module.exports = mongoose.model("user", schema, "user");