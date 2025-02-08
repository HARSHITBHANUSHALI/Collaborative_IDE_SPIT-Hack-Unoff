const mongoose = require('mongoose');


const commitSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: "Commit" },
    content: { type: String, required: true },
    committedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Commit", commitSchema);
  