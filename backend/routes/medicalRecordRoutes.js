const express = require("express");

const router = express.Router();

const {
    
    getPatientMedicalRecords
} = require("../controllers/medicalRecordController");



router.get("/patient/:patient_id", getPatientMedicalRecords);

module.exports = router;