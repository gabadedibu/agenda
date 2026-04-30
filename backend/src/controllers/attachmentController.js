const path = require("path");
const fs = require("fs");
const Attachment = require("../models/Attachment");
const Agenda = require("../models/Agenda");
const AgendaUpdate = require("../models/AgendaUpdate");
const AuditLog = require("../models/AuditLog");

exports.uploadAgendaAttachment = async (req, res) => {
  try {
    const { visibility = "public" } = req.body;

    const agenda = await Agenda.findById(req.params.agendaId);

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    const isOwner = String(agenda.createdBy) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to upload to this agenda" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await Attachment.create({
      fileName: req.file.originalname,
      fileUrl: `/uploads/agendas/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      agendaId: agenda._id,
      visibility,
    });

    await AuditLog.create({
      userId: req.user._id,
      action: "UPLOAD_AGENDA_ATTACHMENT",
      entityType: "Attachment",
      entityId: attachment._id,
      description: `Uploaded file to agenda: ${agenda.title}`,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      attachment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadUpdateAttachment = async (req, res) => {
  try {
    const { visibility = "public" } = req.body;

    const update = await AgendaUpdate.findById(req.params.updateId);

    if (!update) {
      return res.status(404).json({ message: "Agenda update not found" });
    }

    const agenda = await Agenda.findById(update.agendaId);

    const isOwner = String(update.createdBy) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to upload to this update" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await Attachment.create({
      fileName: req.file.originalname,
      fileUrl: `/uploads/updates/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      agendaId: agenda._id,
      updateId: update._id,
      visibility,
    });

    await AuditLog.create({
      userId: req.user._id,
      action: "UPLOAD_UPDATE_ATTACHMENT",
      entityType: "Attachment",
      entityId: attachment._id,
      description: `Uploaded file to agenda update`,
    });

    res.status(201).json({
      message: "Update file uploaded successfully",
      attachment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgendaAttachments = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.agendaId);

    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }

    const isPublic = agenda.status === "approved" && agenda.publicVisible;

    const filter = {
      agendaId: agenda._id,
      updateId: null,
    };

    if (!req.user && isPublic) {
      filter.visibility = "public";
    }

    const attachments = await Attachment.find(filter).sort({ createdAt: -1 });

    res.json({ attachments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.previewAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.attachmentId).populate("agendaId");

    if (!attachment) {
      return res.status(404).json({ message: "File not found" });
    }

    const agenda = attachment.agendaId;

    const isPublicFile =
      attachment.visibility === "public" &&
      agenda &&
      agenda.status === "approved" &&
      agenda.publicVisible;

    if (!isPublicFile && !req.user) {
      return res.status(401).json({ message: "Login required to access this file" });
    }

    const filePath = path.join(__dirname, "../..", attachment.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical file missing" });
    }

    res.setHeader("Content-Type", attachment.fileType);
    res.setHeader("Content-Disposition", `inline; filename="${attachment.fileName}"`);

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.attachmentId).populate("agendaId");

    if (!attachment) {
      return res.status(404).json({ message: "File not found" });
    }

    const agenda = attachment.agendaId;

    const isPublicFile =
      attachment.visibility === "public" &&
      agenda &&
      agenda.status === "approved" &&
      agenda.publicVisible;

    if (!isPublicFile && !req.user) {
      return res.status(401).json({ message: "Login required to access this file" });
    }

    const filePath = path.join(__dirname, "../..", attachment.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical file missing" });
    }

    res.download(filePath, attachment.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};