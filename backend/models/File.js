const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },  // Reference to parent folder
    content: { type: String, default: "" },
    versions: [
      {
        content: { type: String, required: true },
        committedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("File", fileSchema);
