const db = require("../config/db");

const getDashboardData = async (req, res) => {
    try {

        const patients = await db.query(
            "SELECT COUNT(*) FROM patients"
        );

        const doctors = await db.query(
            "SELECT COUNT(*) FROM doctors"
        );

        const appointments = await db.query(
            "SELECT COUNT(*) FROM appointments"
        );

        const revenue = await db.query(
            "SELECT COALESCE(SUM(amount),0) AS total_revenue FROM bills"
        );

        res.json({
            success: true,
            totalPatients: patients.rows[0].count,
            totalDoctors: doctors.rows[0].count,
            totalAppointments: appointments.rows[0].count,
            totalRevenue: revenue.rows[0].total_revenue
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardData
};