const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  assignHead,
} = require("../controllers/departmentController");

const router = express.Router();
const {
  createDepartment,
  createDepartmentWithHead,
  getDepartments,
  updateDepartment,
  assignHead,
} = require("../controllers/departmentController");

router.use(protect);

router.get("/", authorize("admin"), getDepartments);
router.post("/create-with-head", authorize("admin"), createDepartmentWithHead);
router.post("/", authorize("admin"), createDepartment);
router.patch("/:id", authorize("admin"), updateDepartment);
router.patch("/:id/assign-head", authorize("admin"), assignHead);

module.exports = router;