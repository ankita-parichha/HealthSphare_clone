const db = require("../config/db");

const getDashboardStats = async (req, res) => {

    try {

        const totalPatients = await db.query(
            "SELECT COUNT(*) FROM patients"
        );

        const totalDoctors = await db.query(
            "SELECT COUNT(*) FROM doctors"
        );

        const totalAppointments = await db.query(
            "SELECT COUNT(*) FROM appointments"
        );

        const pendingAppointments = await db.query(
            "SELECT COUNT(*) FROM appointments WHERE status='Pending'"
        );

        const confirmedAppointments = await db.query(
            "SELECT COUNT(*) FROM appointments WHERE status='Confirmed'"
        );

        const totalRevenue = await db.query(
            "SELECT COALESCE(SUM(amount),0) FROM bills WHERE payment_status='Paid'"
        );

        const pendingBills = await db.query(
            "SELECT COUNT(*) FROM bills WHERE payment_status='Pending'"
        );

        res.json({

            success: true,

            stats: {

                totalPatients:
                totalPatients.rows[0].count,

                totalDoctors:
                totalDoctors.rows[0].count,

                totalAppointments:
                totalAppointments.rows[0].count,

                pendingAppointments:
                pendingAppointments.rows[0].count,

                confirmedAppointments:
                confirmedAppointments.rows[0].count,

                totalRevenue:
                totalRevenue.rows[0].coalesce,

                pendingBills:
                pendingBills.rows[0].count

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===========================
// Dashboard Data
// ===========================

const getDashboard = async (req, res) => {

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
            "SELECT COALESCE(SUM(amount),0) AS total FROM bills"
        );

        const upcomingAppointments = await db.query(`
    SELECT
       u.full_name AS patient,
        d.first_name || ' ' || d.last_name AS doctor,
        a.status
    FROM appointments a
    JOIN patients p
        ON a.patient_id = p.patient_id
    JOIN users u
        ON p.user_id = u.user_id
    JOIN doctors d
        ON a.doctor_id = d.doctor_id
    ORDER BY a.appointment_date
    LIMIT 5
`);

        const notifications = await db.query(`
            SELECT message
            FROM notifications
            ORDER BY created_at DESC
            LIMIT 5
        `);

        res.json({

            totalPatients: patients.rows[0].count,
            totalDoctors: doctors.rows[0].count,
            totalAppointments: appointments.rows[0].count,
            totalRevenue: revenue.rows[0].total,
            appointments: upcomingAppointments.rows,
            notifications: notifications.rows

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
    getDashboardStats,
    getDashboard
};