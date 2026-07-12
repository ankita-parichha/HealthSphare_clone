const express = require("express");
const router = express.Router();

const {
    getPatientNotifications
} = require("../controllers/notificationController");

router.get("/:patient_id", getPatientNotifications);

module.exports = router;