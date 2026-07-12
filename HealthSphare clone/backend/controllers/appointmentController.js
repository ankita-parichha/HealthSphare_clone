const db = require("../config/db");

const bookAppointment = async (req, res) => {

    try {

        const {
    user_id,
    doctor_id,
    appointment_date,
    appointment_time,
    reason
} = req.body;
        // Find patient using user_id
        const patientResult = await db.query(
            "SELECT patient_id FROM patients WHERE user_id = $1",
            [user_id]
        );

        if (patientResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        const patient_id = patientResult.rows[0].patient_id;

        // Find doctor using doctor name
        


        const appointmentNumber =
            "APT" + Date.now();

        await db.query(
`
INSERT INTO appointments
(
    appointment_number,
    patient_id,
    doctor_id,
    
    appointment_date,
    appointment_time,
    reason,
    status
)
VALUES
($1,$2,$3,$4,$5,$6,$7)
`,
[
    appointmentNumber,
    patient_id,
    doctor_id,
    
    appointment_date,
    appointment_time,
    reason,
    "Pending"
]
);
        res.json({
            success: true,
            message: "Appointment Booked Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===============================
// Get Doctor Appointments
// ===============================

const getDoctorAppointments = async (req, res) => {
     console.log("getDoctorAppointments called");
    console.log(req.params);

    try {

        const { doctor_id } = req.params;

        const result = await db.query(

            `SELECT DISTINCT

p.patient_id,
p.patient_code,
p.full_name,
p.age,
p.gender,

MAX(a.appointment_date) AS last_visit

FROM appointments a

JOIN patients p
ON a.patient_id = p.patient_id

WHERE a.doctor_id = $1

GROUP BY

p.patient_id,
p.patient_code,
p.full_name,
p.age,
p.gender

ORDER BY last_visit DESC`,
[doctor_id]
        );
        res.json({
            success: true,
            appointments: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getTodayPatients = async (req, res) => {

    try {

        const { doctor_id } = req.params;

        const result = await db.query(

            `SELECT
                a.appointment_id,
                p.patient_id,
                p.full_name,
                a.appointment_time,
                a.reason,
                a.status

             FROM appointments a

             JOIN patients p
             ON a.patient_id = p.patient_id

             WHERE
                 a.doctor_id = $1
                 AND a.appointment_date = CURRENT_DATE

             ORDER BY a.appointment_time`,

            [doctor_id]

        );

        res.json({
            success: true,
            patients: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const acceptAppointment = async (req, res) => {

    try {

        const { appointment_id } = req.params;

        // Update appointment status
        await db.query(
            "UPDATE appointments SET status='Confirmed' WHERE appointment_id=$1",
            [appointment_id]
        );

        // Get patient and doctor details
        const appointment = await db.query(
            `
            SELECT
                patient_id,
                doctor_id
            FROM appointments
            WHERE appointment_id = $1
            `,
            [appointment_id]
        );

        if (appointment.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        const patient_id = appointment.rows[0].patient_id;
        const doctor_id = appointment.rows[0].doctor_id;

        // Create notification
        await db.query(
            `
            INSERT INTO notifications
            (
                patient_id,
                appointment_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3,$4)
            `,
            [
                patient_id,
                appointment_id,
                "Appointment Confirmed",
                "Your appointment has been confirmed by the doctor."
            ]
        );

        // Generate Bill
        const billNumber = "BILL" + Date.now();

        await db.query(
            `
            INSERT INTO bills
            (
                bill_number,
                appointment_id,
                patient_id,
                doctor_id,
                amount,
                payment_status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            `,
            [
                billNumber,
                appointment_id,
                patient_id,
                doctor_id,
                800,
                "Pending"
            ]
        );

        res.json({
            success: true,
            message: "Appointment Confirmed"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const rejectAppointment = async (req, res) => {

    try {

        const { appointment_id } = req.params;

        // Get patient_id for this appointment
        const appointment = await db.query(
            `SELECT patient_id
             FROM appointments
             WHERE appointment_id = $1`,
            [appointment_id]
        );

        if (appointment.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        const patient_id = appointment.rows[0].patient_id;

        // Update appointment status
        await db.query(
            `UPDATE appointments
             SET status='Rejected'
             WHERE appointment_id=$1`,
            [appointment_id]
        );

        // Create notification
        await db.query(
            `INSERT INTO notifications
            (
                patient_id,
                appointment_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3,$4)`,
            [
                patient_id,
                appointment_id,
                "Appointment Rejected",
                "Your appointment request has been rejected by the doctor."
            ]
        );

        res.json({
            success: true,
            message: "Appointment Rejected"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getPatientHistory = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(

            `SELECT
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status,
                d.first_name,
                d.last_name,
                d.specialization

             FROM appointments a

             JOIN doctors d
             ON a.doctor_id = d.doctor_id

             WHERE a.patient_id = $1

             ORDER BY a.appointment_date DESC`,

            [patient_id]

        );

        res.json({
            success: true,
            history: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===============================
// Register Appointment (Admin)
// ===============================

const registerAppointment = async (req, res) => {

    try {

        const {

            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            status

        } = req.body;

        // Find Department from Doctor
        const doctor = await db.query(

            `SELECT
                specialization,
                department_id
             FROM doctors
             WHERE doctor_id=$1`,

            [doctor_id]

        );

        if (doctor.rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Doctor Not Found"

            });

        }

        const department_id = doctor.rows[0].department_id;

        const appointmentNumber =
            "APT" + Date.now();

        await db.query(

            `INSERT INTO appointments
            (
                appointment_number,
                patient_id,
                doctor_id,
                
                appointment_date,
                appointment_time,
                reason,
                status
            )

            VALUES
            ($1,$2,$3,$4,$5,$6,$7)`,

            [

                appointmentNumber,
                patient_id,
                doctor_id,
                
                appointment_date,
                appointment_time,
                "Admin Appointment",
                status

            ]

        );

        res.json({

            success: true,
            message: "Appointment Added Successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// ===============================
// Update Appointment
// ===============================

const updateAppointment = async (req, res) => {

    try {

        const { appointmentId } = req.params;

        const {

            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            status

        } = req.body;

        // Find Department from Doctor
        const doctor = await db.query(

            `SELECT department_id
             FROM doctors
             WHERE doctor_id=$1`,

            [doctor_id]

        );

        if (doctor.rows.length === 0) {

            return res.status(404).json({

                success:false,
                message:"Doctor Not Found"

            });

        }

        const department_id = doctor.rows[0].department_id;

        await db.query(

            `UPDATE appointments

             SET

             patient_id=$1,
             doctor_id=$2,
             appointment_date=$3,
             appointment_time=$4,
             status=$5

             WHERE appointment_id=$6`,

            [

                patient_id,
                doctor_id,
                
                appointment_date,
                appointment_time,
                status,
                appointmentId

            ]

        );

        res.json({

            success:true,
            message:"Appointment Updated Successfully"

        });

    } catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};
// ===============================
// Delete Appointment
// ===============================

const deleteAppointment = async (req, res) => {

    try {

        const { appointmentId } = req.params;

        await db.query(

            "DELETE FROM appointments WHERE appointment_id=$1",

            [appointmentId]

        );

        res.json({

            success: true,
            message: "Appointment Deleted Successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// ===============================
// Get All Appointments
// ===============================
const getAllAppointments = async (req, res) => {

    try {

        const result = await db.query(

`
SELECT

a.appointment_id,
a.appointment_number,

a.patient_id,
a.doctor_id,

p.patient_code,
p.full_name AS patient_name,

d.first_name || ' ' || d.last_name AS doctor_name,

a.appointment_date,
a.appointment_time,
a.status

FROM appointments a

JOIN patients p
ON a.patient_id = p.patient_id

JOIN doctors d
ON a.doctor_id = d.doctor_id

ORDER BY
a.appointment_date DESC,
a.appointment_time DESC;`
);

        res.json({
            success: true,
            appointments: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ===============================
// Get Logged-in Patient Appointments
// ===============================

const getPatientAppointments = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(

            `SELECT

                a.appointment_number,

                d.first_name || ' ' || d.last_name AS doctor_name,

                a.appointment_date,

                a.appointment_time,

                a.status

            FROM appointments a

            JOIN doctors d
            ON a.doctor_id = d.doctor_id

            WHERE a.patient_id = $1

            ORDER BY a.appointment_date DESC,
                     a.appointment_time DESC`,

            [patient_id]

        );

        res.json({

            success: true,

            appointments: result.rows

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
    bookAppointment,
registerAppointment,
getDoctorAppointments,
getTodayPatients,
getPatientHistory,
acceptAppointment,
rejectAppointment,
getAllAppointments,
getPatientAppointments,
updateAppointment,
deleteAppointment
};