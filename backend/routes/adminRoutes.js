const express = require("express");

const router = express.Router();

const {
    loginAdmin,
    getDashboard
} = require("../controllers/adminController");

router.post("/login", loginAdmin);

router.get("/dashboard", getDashboard);

module.exports = router;