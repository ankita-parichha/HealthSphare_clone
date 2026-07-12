const express = require("express");

const router = express.Router();

const {

    bookAppointment,
getDoctorAppointments,
acceptAppointment,
rejectAppointment,
getAllAppointments,
getPatientAppointments,
getPatientHistory,

registerAppointment,
updateAppointment,
deleteAppointment

} = require("../controllers/appointmentController");

router.post("/book", bookAppointment);

router.get("/doctor/:doctor_id", getDoctorAppointments);

router.put("/accept/:appointment_id", acceptAppointment);

router.put("/reject/:appointment_id", rejectAppointment);


router.get("/all", getAllAppointments);
router.get("/patient/:patient_id", getPatientAppointments);
router.get("/history/:patient_id", getPatientHistory);
// Admin CRUD
router.post("/register", registerAppointment);

router.put("/:appointmentId", updateAppointment);

router.delete("/:appointmentId", deleteAppointment);

module.exports = router;