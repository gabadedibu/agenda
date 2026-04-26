const Department = require("../models/Department");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const department = await Department.create({
      name,
      code,
      description,
    });

    await AuditLog.create({
      userId: req.user._id,
      action: "CREATE_DEPARTMENT",
      entityType: "Department",
      entityId: department._id,
      description: `Created department ${name}`,
    });

    res.status(201).json({ message: "Department created", department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("headId", "name email role")
      .sort({ createdAt: -1 });

    res.json({ departments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name, code, description, isActive } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, code, description, isActive },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await AuditLog.create({
      userId: req.user._id,
      action: "UPDATE_DEPARTMENT",
      entityType: "Department",
      entityId: department._id,
      description: `Updated department ${department.name}`,
    });

    res.json({ message: "Department updated", department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignHead = async (req, res) => {
  try {
    const { headId } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const user = await User.findById(headId);
    if (!user || user.role !== "department_head") {
      return res.status(400).json({ message: "User must be a department head" });
    }

    department.headId = headId;
    await department.save();

    user.departmentId = department._id;
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      action: "ASSIGN_DEPARTMENT_HEAD",
      entityType: "Department",
      entityId: department._id,
      description: `Assigned ${user.name} as head of ${department.name}`,
    });

    res.json({ message: "Department head assigned", department });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};