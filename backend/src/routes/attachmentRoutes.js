const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadAgendaAttachment,
  uploadUpdateAttachment,
  getAgendaAttachments,
  downloadAttachment,
} = require("../controllers/attachmentController");

const router = express.Router();

router.post(
  "/agenda/:agendaId",
  protect,
  upload.single("file"),
  uploadAgendaAttachment
);

router.post(
  "/update/:updateId",
  protect,
  upload.single("file"),
  uploadUpdateAttachment
);

router.get("/agenda/:agendaId", getAgendaAttachments);

router.get("/download/:attachmentId", downloadAttachment);

module.exports = router;