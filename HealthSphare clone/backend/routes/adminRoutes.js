const express = require("express");

const router = express.Router();

const {
    loginAdmin
} = require("../controllers/adminController");

const {
    getDashboardData
} = require("../controllers/adminDashboardController");

router.post("/login", loginAdmin);

router.get("/dashboard", getDashboardData);

module.exports = router;