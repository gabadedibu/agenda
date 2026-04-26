const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    agendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      default: null,
    },

    updateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AgendaUpdate",
      default: null,
    },

    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "public",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attachment", attachmentSchema);