const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null }, // Nested structure
    isFolder: { type: Boolean, required: true, default: false },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // Only if it's a folder
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["owner", "editor", "viewer"], default: "viewer" },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Project", projectSchema);
  