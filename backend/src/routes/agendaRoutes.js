const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createAgenda,
  getMyAgendas,
  updateMyAgenda,
  submitAgenda,
  getAllAgendas,
  reviewAgenda,
  addAgendaUpdate,
  getPublicAgendas,
  getPublicAgendaDetails,
} = require("../controllers/agendaController");

const router = express.Router();

// Public routes
router.get("/public", getPublicAgendas);
router.get("/public/:id", getPublicAgendaDetails);

// Department head routes
router.post("/", protect, authorize("department_head"), createAgenda);
router.get("/my", protect, authorize("department_head"), getMyAgendas);
router.patch("/:id", protect, authorize("department_head"), updateMyAgenda);
router.patch("/:id/submit", protect, authorize("department_head"), submitAgenda);
router.post("/:id/updates", protect, authorize("department_head"), addAgendaUpdate);

// Admin routes
router.get("/", protect, authorize("admin"), getAllAgendas);
router.patch("/:id/review", protect, authorize("admin"), reviewAgenda);

module.exports = router;