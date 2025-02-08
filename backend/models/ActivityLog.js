

const activityLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    action: { type: String, enum: ["created", "edited", "deleted", "shared", "committed"], required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("ActivityLog", activityLogSchema);
  