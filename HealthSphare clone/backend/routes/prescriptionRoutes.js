const express = require("express");
const router = express.Router();

const {
    addPrescription,
    getPatientPrescriptions,
    getDoctorPrescriptions
} = require("../controllers/prescriptionController");

router.post("/add", addPrescription);
router.get(
"/patient/:patient_id",
getPatientPrescriptions
);
router.get("/doctor/:doctor_id", getDoctorPrescriptions);
module.exports = router;