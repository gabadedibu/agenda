const Agenda = require("../models/Agenda");
const AgendaUpdate = require("../models/AgendaUpdate");
const AuditLog = require("../models/AuditLog");

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
        message: "Only draft, rejected, or revision agendas can be edited",
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

exports.submitAgenda = async (req, res) => {
  try {
    const agenda = await Agenda.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    if (!["draft", "needs_revision", "rejected"].includes(agenda.status)) {
      return res.status(400).json({ message: "Agenda cannot be submitted now" });
    }

    agenda.status = "pending";
    agenda.publicVisible = false;
    agenda.adminFeedback = "";

    await agenda.save();

    await AuditLog.create({
      userId: req.user._id,
      action: "SUBMIT_AGENDA",
      entityType: "Agenda",
      entityId: agenda._id,
      description: `Submitted agenda: ${agenda.title}`,
    });

    res.json({ message: "Agenda submitted for approval", agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAgendas = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const agendas = await Agenda.find(filter)
      .populate("departmentId", "name code")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ agendas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reviewAgenda = async (req, res) => {
  try {
    const { action, feedback } = req.body;

    const agenda = await Agenda.findById(req.params.id);

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    if (agenda.status !== "pending") {
      return res.status(400).json({ message: "Only pending agendas can be reviewed" });
    }

    if (action === "approve") {
      agenda.status = "approved";
      agenda.publicVisible = true;
      agenda.adminFeedback = feedback || "Approved";
    } else if (action === "reject") {
      agenda.status = "rejected";
      agenda.publicVisible = false;
      agenda.adminFeedback = feedback || "Rejected";
    } else if (action === "revision") {
      agenda.status = "needs_revision";
      agenda.publicVisible = false;
      agenda.adminFeedback = feedback || "Revision required";
    } else {
      return res.status(400).json({ message: "Invalid review action" });
    }

    await agenda.save();

    await AuditLog.create({
      userId: req.user._id,
      action: `AGENDA_${action.toUpperCase()}`,
      entityType: "Agenda",
      entityId: agenda._id,
      description: `${action} agenda: ${agenda.title}`,
    });

    res.json({ message: `Agenda ${action} successful`, agenda });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAgendaUpdate = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    if (agenda.status !== "approved") {
      return res.status(400).json({ message: "Only approved agendas can receive updates" });
    }

    if (String(agenda.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only update your own agenda" });
    }

    const { title, content } = req.body;

    const update = await AgendaUpdate.create({
      agendaId: agenda._id,
      title,
      content,
      createdBy: req.user._id,
    });

    await AuditLog.create({
      userId: req.user._id,
      action: "ADD_AGENDA_UPDATE",
      entityType: "AgendaUpdate",
      entityId: update._id,
      description: `Added update to agenda: ${agenda.title}`,
    });

    res.status(201).json({ message: "Agenda update added", update });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicAgendas = async (req, res) => {
  try {
    const { department, priority, search } = req.query;

    const filter = {
      status: "approved",
      publicVisible: true,
    };

    if (priority) filter.priority = priority;
    if (department) filter.departmentId = department;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const agendas = await Agenda.find(filter)
      .populate("departmentId", "name code")
      .sort({ createdAt: -1 });

    res.json({ agendas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicAgendaDetails = async (req, res) => {
  try {
    const Attachment = require("../models/Attachment");

    const agenda = await Agenda.findOne({
      _id: req.params.id,
      status: "approved",
      publicVisible: true,
    }).populate("departmentId", "name code");

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    const updates = await AgendaUpdate.find({ agendaId: agenda._id })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    const updateIds = updates.map((update) => update._id);

    const updateAttachments = await Attachment.find({
      updateId: { $in: updateIds },
      visibility: "public",
    }).lean();

    const updatesWithAttachments = updates.map((update) => ({
      ...update,
      attachments: updateAttachments.filter(
        (file) => String(file.updateId) === String(update._id)
      ),
    }));

    res.json({
      agenda,
      updates: updatesWithAttachments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};