const express = require("express");

const router = express.Router();

const {

getDepartments,
registerDepartment,
updateDepartment,
deleteDepartment

} = require("../controllers/departmentController");

// Get All Departments
router.get("/", getDepartments);

// Add Department
router.post("/register", registerDepartment);

// Update Department
router.put("/:departmentId", updateDepartment);

// Delete Department
router.delete("/:departmentId", deleteDepartment);

module.exports = router;