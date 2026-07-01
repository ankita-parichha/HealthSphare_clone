const db = require("../config/db");
const bcrypt = require("bcrypt");

// =============================
// Register Patient
// =============================
const registerPatient = async (req, res) => {
    console.log("===== REGISTER API CALLED =====");
console.log(req.body);
    try {

        const {
            full_name,
            age,
            gender,
            blood_group,
            phone,
            email,
            address,
            emergency_contact_name,
            emergency_contact_phone,
            password
        } = req.body;

        // Check if all required fields are filled
        if (
    !full_name ||
    age === undefined ||
    age === null ||
    !gender ||
    !blood_group ||
    !phone ||
    !email ||
    !address ||
    !password

        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check if email already exists
        console.log("Checking email:", email);

const checkUser = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
);

console.log("Existing user:", checkUser.rows);

        if (checkUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table
        const userResult = await db.query(
            `INSERT INTO users
            (full_name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id`,
            [
                full_name,
                email,
                hashedPassword,
                "Patient"
            ]
        );

        const userId = userResult.rows[0].user_id;
        console.log("User inserted with ID:", userId);

        // Generate Patient Code
        const patientCode = "PAT" + String(userId).padStart(4, "0");

        // Insert into patients table
        await db.query(
            `INSERT INTO patients
            (
                user_id,
                patient_code,
                full_name,
                age,
                gender,
                blood_group,
                phone,
                email,
                address,
                emergency_contact_name,
                emergency_contact_phone
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
                userId,
                patientCode,
                full_name,
                age,
                gender,
                blood_group,
                phone,
                email,
                address,
                emergency_contact_name,
                emergency_contact_phone
            ]
        );
        console.log("Patient inserted successfully");
      
        res.status(201).json({
            success: true,
            message: "Patient Registered Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// =========================
// Patient Login
// =========================
const loginPatient = async (req, res) => {

    try {

        const { email, password } = req.body;
        console.log("Email received:", email);

const user = await db.query(
    "SELECT * FROM users WHERE LOWER(email)=LOWER($1)",
    [email.trim()]
);

console.log("User Found:", user.rows);

        

        if (user.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

    console.log("Entered Password:", password);
console.log("Stored Hash:", user.rows[0].password);

const validPassword = await bcrypt.compare(
    password,
    user.rows[0].password
);

console.log("Password Match:", validPassword);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Get patient details
const patient = await db.query(
    "SELECT * FROM patients WHERE user_id = $1",
    [user.rows[0].user_id]
);
console.log("Patient Data:", patient.rows);

if (patient.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Patient profile not found"
    });
}

res.json({
    success: true,
    message: "Login Successful",
    user: {
        user_id: user.rows[0].user_id,
        patient_id: patient.rows[0].patient_id,
        patient_code: patient.rows[0].patient_code,
        full_name: patient.rows[0].full_name,
        email: patient.rows[0].email,
        role: user.rows[0].role
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

const getPatientProfile = async (req, res) => {
    try {

        const { userId } = req.params;

        const result = await db.query(
            `SELECT *
             FROM patients
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            patient: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updatePatientProfile = async (req, res) => {

    try {

        const { userId } = req.params;

        const {
            full_name,
            age,
            gender,
            blood_group,
            phone,
            email,
            address,
            emergency_contact_name,
            emergency_contact_phone
        } = req.body;

        await db.query(

            `UPDATE patients
             SET
             full_name=$1,
             age=$2,
             gender=$3,
             blood_group=$4,
             phone=$5,
             email=$6,
             address=$7,
             emergency_contact_name=$8,
             emergency_contact_phone=$9
             WHERE user_id=$10`,

            [
                full_name,
                age,
                gender,
                blood_group,
                phone,
                email,
                address,
                emergency_contact_name,
                emergency_contact_phone,
                userId
            ]

        );

        await db.query(

            `UPDATE users
             SET
             full_name=$1,
             email=$2
             WHERE user_id=$3`,

            [
                full_name,
                email,
                userId
            ]

        );

        res.json({
            success:true,
            message:"Profile Updated Successfully"
        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};
const getPatients = async (req,res)=>{

const result = await db.query(

`SELECT
user_id,
full_name
FROM users
WHERE role='Patient'
ORDER BY full_name`

);

res.json({

success:true,

patients:result.rows

});

};
module.exports = {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    getPatients
};