const Agenda = require("../models/Agenda");
const AgendaUpdate = require("../models/AgendaUpdate");
const AuditLog = require("../models/AuditLog");

// CREATE
exports.createAgenda = async (req, res) => {
  try {
    const { title, summary, description, proposedDate, priority } = req.body;

    if (!req.user.departmentId) {
      return res.status(400).json({ message: "Department head has no department assigned" });
    }

    const agenda = await Agenda.create({
      title,
      summary,
      description,
      proposedDate,
      priority,
      departmentId: req.user.departmentId,
      createdBy: req.user._id,
      status: "draft",
      publicVisible: false,
    });

    res.status(201).json({ message: "Agenda draft created", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MY AGENDAS
exports.getMyAgendas = async (req, res) => {
  try {
    const agendas = await Agenda.find({ createdBy: req.user._id })
      .populate("departmentId", "name code")
      .sort({ createdAt: -1 });

    res.json({ agendas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateMyAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    if (!["draft", "needs_revision", "rejected"].includes(agenda.status)) {
      return res.status(400).json({
        message: "Only draft/revision/rejected agendas can be edited",
      });
    }

    const { title, summary, description, proposedDate, priority } = req.body;

    agenda.title = title ?? agenda.title;
    agenda.summary = summary ?? agenda.summary;
    agenda.description = description ?? agenda.description;
    agenda.proposedDate = proposedDate ?? agenda.proposedDate;
    agenda.priority = priority ?? agenda.priority;

    await agenda.save();

    res.json({ message: "Agenda updated", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT
exports.submitAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agenda) return res.status(404).json({ message: "Agenda not found" });

    if (!["draft", "needs_revision", "rejected"].includes(agenda.status)) {
      return res.status(400).json({ message: "Cannot submit now" });
    }

    agenda.status = "pending";
    agenda.publicVisible = false;
    agenda.adminFeedback = "";

    await agenda.save();

    res.json({ message: "Submitted for approval", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN GET ALL
exports.getAllAgendas = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const agendas = await Agenda.find(filter)
      .populate("departmentId", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({ agendas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REVIEW
exports.reviewAgenda = async (req, res) => {
  try {
    const { action } = req.body;

    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) return res.status(404).json({ message: "Not found" });

    if (agenda.status !== "pending") {
      return res.status(400).json({ message: "Not pending" });
    }

    if (action === "approve") {
      agenda.status = "approved";
      agenda.publicVisible = true;
    } else if (action === "reject") {
      agenda.status = "rejected";
      agenda.publicVisible = false;
    } else if (action === "revision") {
      agenda.status = "needs_revision";
      agenda.publicVisible = false;
    }

    await agenda.save();

    res.json({ message: "Reviewed", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ARCHIVE
exports.archiveAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) return res.status(404).json({ message: "Not found" });

    agenda.status = "archived";
    agenda.publicVisible = false;

    await agenda.save();

    res.json({ message: "Archived", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 DELETE (only archived)
exports.deleteAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) return res.status(404).json({ message: "Not found" });

    if (agenda.status !== "archived") {
      return res.status(400).json({ message: "Only archived can be deleted" });
    }

    await agenda.deleteOne();

    res.json({ message: "Deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 UNARCHIVE (NEW)
exports.unarchiveAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    if (agenda.status !== "archived") {
      return res.status(400).json({
        message: "Only archived agendas can be unarchived",
      });
    }

    agenda.status = "approved";
    agenda.publicVisible = true;

    await agenda.save();

    await AuditLog.create({
      userId: req.user._id,
      action: "UNARCHIVE_AGENDA",
      entityType: "Agenda",
      entityId: agenda._id,
      description: `Unarchived agenda: ${agenda.title}`,
    });

    res.json({
      message: "Agenda unarchived successfully",
      agenda,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};