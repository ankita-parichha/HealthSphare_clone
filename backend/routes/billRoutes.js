const express = require("express");

const router = express.Router();

const {
    getPatientBills,
    payBill,
    getAllBills
} = require("../controllers/billController");

router.get("/patient/:patient_id", getPatientBills);
router.put("/pay/:bill_id", payBill);
router.get("/all", getAllBills);

module.exports = router;