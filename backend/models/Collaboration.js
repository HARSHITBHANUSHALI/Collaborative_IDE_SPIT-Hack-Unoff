const mongoose = require('mongoose');


const collaborationSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "editor", "viewer"], required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Collaboration", collaborationSchema);
  