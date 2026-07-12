const express = require("express");

const router = express.Router();

const {

registerPatient,
getPatients,
updatePatient,
deletePatient,
getPatientById

} = require("../controllers/patientController");

router.post("/register", registerPatient);

router.get("/", getPatients);

router.put("/:patientId", updatePatient);

router.delete("/:patientId", deletePatient);
router.get("/:patientId", getPatientById);

module.exports = router;