const db = require("../config/db");
const bcrypt = require("bcrypt");

const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check if admin exists
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1 AND role = 'Admin'",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = result.rows[0];

        // Check password
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
                user_id: admin.user_id,
                full_name: admin.full_name,
                email: admin.email,
                role: admin.role
            }
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
    loginAdmin
};