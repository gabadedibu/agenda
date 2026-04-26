const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: String,
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);