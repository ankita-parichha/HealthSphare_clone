const db = require("../config/db");
const bcrypt = require("bcrypt");

const registerDoctor = async (req, res) => {

    try {

       const {
    first_name,
    last_name,
    gender,
    specialization,
    qualification,
    experience,
    consultation_fee,
    phone,
    email,
    password
} = req.body;

        // Check email
        const checkUser = await db.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users
        const userResult = await db.query(

            `INSERT INTO users
            (full_name,email,password,role)
            VALUES($1,$2,$3,$4)
            RETURNING user_id`,

            [
                `${first_name} ${last_name}`,
                email,
                hashedPassword,
                "Doctor"
            ]

        );

        const userId = userResult.rows[0].user_id;

        const doctorCode =
            "DOC" + String(userId).padStart(4, "0");

        // Insert into doctors
        await db.query(

            `INSERT INTO doctors
            (
    user_id,
    doctor_code,
    first_name,
    last_name,
    gender,
    specialization,
    qualification,
    experience,
    consultation_fee,
    phone,
    email,
    status
)

VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
            [
    userId,
    doctorCode,
    first_name,
    last_name,
    gender,
    specialization,
    qualification,
    experience,
    consultation_fee,
    phone,
    email,
    "Active"
]

        );

        res.status(201).json({

            success: true,
            message: "Doctor Registered Successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// =============================
// Doctor Login
// =============================
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body;

       console.log("Email received:", `"${email}"`);

const user = await db.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND role = 'Doctor'",
    [email.trim()]
);

console.log("User rows:", user.rows);

        if (user.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const doctor = await db.query(
            "SELECT * FROM doctors WHERE user_id = $1",
            [user.rows[0].user_id]
        );

        res.json({
            success: true,
            message: "Doctor Login Successful",
            doctor: doctor.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getDoctors = async (req, res) => {
    try {

        const result = await db.query(
            `SELECT
            doctor_id,
first_name,
last_name,
gender,
specialization,
qualification,
experience,
consultation_fee,
phone,
email,
status
FROM doctors
ORDER BY first_name;
`
        );

        res.json({
            success: true,
            doctors: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ===================================
// Get Doctors By Specialization
// ===================================


// ======================================
// Search Doctor By Name
// ======================================

const searchDoctor = async (req, res) => {

    try {

        const { name } = req.params;

        const result = await db.query(
            `
            SELECT
                doctor_id,
                first_name,
                last_name,
                specialization,
                consultation_fee,
                experience
            FROM doctors
            WHERE
                LOWER(first_name || ' ' || last_name) LIKE LOWER($1)
            `,
            [`%${name}%`]
        );

        res.json({
            success: true,
            doctors: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const updateDoctor = async (req, res) => {

    try {

        const { doctorId } = req.params;

        const {
            first_name,
            last_name,
            specialization,
            qualification,
            experience,
            consultation_fee,
            phone,
            email,
            status
        } = req.body;

        await db.query(

            `UPDATE doctors
             SET
             first_name=$1,
             last_name=$2,
             specialization=$3,
             qualification=$4,
             experience=$5,
             consultation_fee=$6,
             phone=$7,
             email=$8,
             status=$9
             WHERE doctor_id=$10`,

            [
                first_name,
                last_name,
                specialization,
                qualification,
                experience,
                consultation_fee,
                phone,
                email,
                status,
                doctorId
            ]

        );

        res.json({
            success: true,
            message: "Doctor Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const deleteDoctor = async (req, res) => {

    try {

        const { doctorId } = req.params;

        await db.query(
            "DELETE FROM doctors WHERE doctor_id=$1",
            [doctorId]
        );

        res.json({
            success: true,
            message: "Doctor Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { specialization } = req.params;

        const result = await db.query(
            `SELECT
                doctor_id,
                first_name,
                last_name,
                specialization,
                experience
             FROM doctors
             WHERE specialization = $1`,
            [specialization]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
};
module.exports = {
    registerDoctor,
    loginDoctor,
    getDoctors,
    getDoctorsBySpecialization,
    searchDoctor,
    updateDoctor,
    deleteDoctor
};