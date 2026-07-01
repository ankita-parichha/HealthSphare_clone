const express = require("express");

const router = express.Router();

const {

    registerReceptionist,
    loginReceptionist,
    getTodayAppointments,
    getReceptionists,
    updateReceptionist,
    deleteReceptionist

} = require("../controllers/receptionistController");

router.post("/register", registerReceptionist);

router.post("/login", loginReceptionist);

router.get("/", getReceptionists);

router.get("/today-appointments", getTodayAppointments);

router.put("/:receptionistId", updateReceptionist);

router.delete("/:receptionistId", deleteReceptionist);


module.exports = router;