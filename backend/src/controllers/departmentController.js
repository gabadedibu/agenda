const bcrypt = require("bcryptjs");
const Department = require("../models/Department");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
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

exports.createDepartmentWithHead = async (req, res) => {
  try {
    const {
      departmentName,
      departmentCode,
      departmentDescription,
      headName,
      headEmail,
      temporaryPassword,
    } = req.body;

    if (
      !departmentName ||
      !departmentCode ||
      !headName ||
      !headEmail ||
      !temporaryPassword
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const existingDepartment = await Department.findOne({
      $or: [
        { name: departmentName.trim() },
        { code: departmentCode.trim().toUpperCase() },
      ],
    });

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department name or code already exists",
      });
    }

    const existingUser = await User.findOne({
      email: headEmail.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    const department = await Department.create({
      name: departmentName.trim(),
      code: departmentCode.trim().toUpperCase(),
      description: departmentDescription || "",
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(temporaryPassword, salt);

    const head = await User.create({
      name: headName.trim(),
      email: headEmail.trim().toLowerCase(),
      passwordHash,
      role: "department_head",
      departmentId: department._id,
    });

    department.headId = head._id;
    await department.save();

    await AuditLog.create({
      userId: req.user._id,
      action: "CREATE_DEPARTMENT_WITH_HEAD",
      entityType: "Department",
      entityId: department._id,
      description: `Created ${department.name} and assigned ${head.name} as department head`,
    });

    res.status(201).json({
      message: "Department and department head created successfully",
      department,
      head: {
        _id: head._id,
        name: head.name,
        email: head.email,
        role: head.role,
      },
    });
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
      {
        name,
        code: code ? code.toUpperCase() : code,
        description,
        isActive,
      },
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
      return res.status(400).json({
        message: "User must be a department head",
      });
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

    res.json({
      message: "Department head assigned",
      department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};