const mongoose = require("mongoose");

const agendaUpdateSchema = new mongoose.Schema(
  {
    agendaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgendaUpdate", agendaUpdateSchema);