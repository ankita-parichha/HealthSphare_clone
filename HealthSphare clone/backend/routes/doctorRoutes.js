
const express = require("express");

const router = express.Router();

const {

    registerDoctor,
    loginDoctor,
    getDoctors,
    getDoctorsBySpecialization,
    searchDoctor,
    updateDoctor,
    deleteDoctor

} = require("../controllers/doctorController");
router.post("/register", registerDoctor);

router.post("/login", loginDoctor);

router.get("/", getDoctors);
router.get(
    "/specialization/:specialization",
    getDoctorsBySpecialization
);
router.get(
    "/search/:name",
    searchDoctor
);
router.put("/:doctorId", updateDoctor);

router.delete("/:doctorId", deleteDoctor);

module.exports = router;