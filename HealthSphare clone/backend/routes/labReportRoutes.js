const express = require("express");

const router = express.Router();

const {
    getPatientLabReports
} = require("../controllers/labReportController");

router.get("/patient/:patient_id", getPatientLabReports);

module.exports = router;