const labReportRoutes = require("./routes/labReportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes =
require("./routes/notificationRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const receptionistRoutes = require("./routes/receptionistRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const billRoutes = require("./routes/billRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/bills", billRoutes);

app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/departments", departmentRoutes);
app.use(
"/api/notifications",
notificationRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/lab-reports", labReportRoutes);
// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to HealthSphere Backend 🚀");
});

// Test Database Route
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Database Connected Successfully",
            serverTime: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
