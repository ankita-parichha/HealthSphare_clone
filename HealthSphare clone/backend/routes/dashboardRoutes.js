const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

// Dashboard statistics
router.get("/", dashboardController.getDashboard);

// Optional: separate stats endpoint
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;