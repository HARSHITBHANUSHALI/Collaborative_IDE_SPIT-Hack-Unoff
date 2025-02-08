const mongoose = require('mongoose');


const activeSessionSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    joinedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("ActiveSession", activeSessionSchema);
  