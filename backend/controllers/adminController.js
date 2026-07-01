const db = require("../config/db");
const bcrypt = require("bcrypt");

// ==========================================
// Admin Login
// ==========================================
const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await db.query(
            `
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.password,
                u.role,
                a.admin_id,
                a.employee_id,
                a.phone,
                a.address
            FROM users u
            INNER JOIN admins a
                ON u.user_id = a.user_id
            WHERE u.email = $1
            AND u.role = 'Admin'
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        res.json({
            success: true,
            message: "Admin Login Successful",
            admin: {
                admin_id: admin.admin_id,
                user_id: admin.user_id,
                employee_id: admin.employee_id,
                full_name: admin.full_name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone,
                address: admin.address
            }
        });

    } catch (error) {

        console.error("Admin Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// ==========================================
// Dashboard Statistics
// ==========================================
const getDashboard = async (req, res) => {

    try {

        // Total Patients
        const patientResult = await db.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role='Patient'
        `);

        // Total Doctors
        const doctorResult = await db.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role='Doctor'
        `);

        // Total Appointments
        const appointmentResult = await db.query(`
            SELECT COUNT(*) AS total
            FROM appointments
        `);

        // Total Revenue
        const revenueResult = await db.query(`
            SELECT COALESCE(SUM(total_amount),0) AS revenue
            FROM bills
        `);

        res.json({

            success: true,

            totalPatients: patientResult.rows[0].total,

            totalDoctors: doctorResult.rows[0].total,

            totalAppointments: appointmentResult.rows[0].total,

            totalRevenue: revenueResult.rows[0].revenue

        });

    } catch (error) {

        console.error("Dashboard Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to load dashboard"

        });

    }

};

module.exports = {
    loginAdmin,
    getDashboard
};