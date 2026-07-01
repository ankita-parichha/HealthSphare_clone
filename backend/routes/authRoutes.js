const express = require("express");

const router = express.Router();

const {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    getPatients
} = require("../controllers/authController");

router.post("/register", registerPatient);

router.post("/login", loginPatient);

router.get("/profile/:userId", getPatientProfile);
router.put("/profile/:userId",updatePatientProfile);
router.get("/patients", getPatients);

module.exports = router;