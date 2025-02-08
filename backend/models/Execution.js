const mongoose = require('mongoose');

const executionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
    language: { type: String, required: true },
    input: { type: String, default: "" },
    output: { type: String },
    error: { type: String },
    executedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Execution", executionSchema);
  