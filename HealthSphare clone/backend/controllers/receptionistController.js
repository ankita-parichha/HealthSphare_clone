const db = require("../config/db");
const bcrypt = require("bcrypt");

// ==========================
// Register Receptionist
// ==========================

const registerReceptionist = async (req, res) => {

    try {

        const {

            first_name,
            last_name,
            gender,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            joining_date,
            shift,
            password

        } = req.body;

        // Check Email

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

        // Encrypt Password

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table

        const userResult = await db.query(

            `INSERT INTO users
            (
                full_name,
                email,
                password,
                role
            )

            VALUES($1,$2,$3,$4)

            RETURNING user_id`,

            [

                `${first_name} ${last_name}`,
                email,
                hashedPassword,
                "Receptionist"

            ]

        );

        const userId = userResult.rows[0].user_id;

        const receptionistCode =
        "REC" + String(userId).padStart(4,"0");

        // Insert into receptionists

        await db.query(

        `INSERT INTO receptionists
        (

        user_id,
        receptionist_code,
        first_name,
        last_name,
        gender,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        joining_date,
        shift,
        status

        )

        VALUES
        (

        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14

        )`,

        [

        userId,
        receptionistCode,
        first_name,
        last_name,
        gender,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        joining_date,
        shift,
        "Active"

        ]

        );

        res.json({

            success:true,
            message:"Receptionist Registered Successfully"

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
// ==========================
// Login Receptionist
// ==========================

const loginReceptionist = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await db.query(

            "SELECT * FROM users WHERE LOWER(email)=LOWER($1) AND role='Receptionist'",

            [email.trim()]

        );

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

        const receptionist = await db.query(

            "SELECT * FROM receptionists WHERE user_id=$1",

            [user.rows[0].user_id]

        );

        res.json({

            success: true,
            message: "Receptionist Login Successful",
            receptionist: receptionist.rows[0]

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


// ===============================
// Today's Appointments
// ===============================

const getTodayAppointments = async (req, res) => {

    try {

        const result = await db.query(

        `SELECT

            p.full_name AS patient_name,

            d.first_name || ' ' || d.last_name AS doctor_name,

            a.appointment_time,

            a.status

        FROM appointments a

        JOIN patients p
        ON a.patient_id = p.patient_id

        JOIN doctors d
        ON a.doctor_id = d.doctor_id

        WHERE a.appointment_date = CURRENT_DATE

        ORDER BY a.appointment_time`

        );

        res.json({

            success:true,
            appointments:result.rows

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
// ==========================
// Get All Receptionists
// ==========================

const getReceptionists = async (req, res) => {

    try {

        const result = await db.query(

        `SELECT

        receptionist_id,
        receptionist_code,
        first_name,
        last_name,
        gender,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        joining_date,
        shift,
        status

        FROM receptionists

        ORDER BY receptionist_id`

        );

        res.json({

            success:true,
            receptionists:result.rows

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


// ==========================
// Update Receptionist
// ==========================

// ==========================
// Update Receptionist
// ==========================

const updateReceptionist = async (req, res) => {

    try {

        const { receptionistId } = req.params;

        const {

            first_name,
            last_name,
            gender,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            joining_date,
            shift,
            status

        } = req.body;

        await db.query(

        `UPDATE receptionists

        SET

        first_name=$1,
        last_name=$2,
        gender=$3,
        phone=$4,
        email=$5,
        address=$6,
        city=$7,
        state=$8,
        pincode=$9,
        joining_date=$10,
        shift=$11,
        status=$12

        WHERE receptionist_id=$13`,

        [

        first_name,
        last_name,
        gender,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        joining_date,
        shift,
        status,
        receptionistId

        ]

        );

        // Update users table as well

        await db.query(

        `UPDATE users

        SET

        full_name=$1,
        email=$2

        WHERE user_id=(

            SELECT user_id

            FROM receptionists

            WHERE receptionist_id=$3

        )`,

        [

        first_name + " " + last_name,
        email,
        receptionistId

        ]

        );

        res.json({

            success:true,

            message:"Receptionist Updated Successfully"

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
// ==========================
// Delete Receptionist
// ==========================

const deleteReceptionist = async (req, res) => {

    try {

        const { receptionistId } = req.params;

        // Delete receptionist record
        await db.query(
            "DELETE FROM receptionists WHERE receptionist_id = $1",
            [receptionistId]
        );

        // (Optional) Delete corresponding user
        // Uncomment if you want to remove the user account too.
        /*
        await db.query(
            "DELETE FROM users WHERE user_id = (
                SELECT user_id
                FROM receptionists
                WHERE receptionist_id = $1
            )",
            [receptionistId]
        );
        */

        res.json({
            success: true,
            message: "Receptionist Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================
// Export Controllers
// ==========================

module.exports = {

    registerReceptionist,
    loginReceptionist,
    getTodayAppointments,
    getReceptionists,
    updateReceptionist,
    deleteReceptionist

};