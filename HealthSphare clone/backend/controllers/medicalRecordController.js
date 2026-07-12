
const db = require("../config/db");

// ===========================
// Add Medical Record
// ===========================
const addMedicalRecord = async (req, res) => {

    try {

        const {
            patient_id,
            doctor_id,
            diagnosis,
            treatment,
            notes
        } = req.body;

        await db.query(

            `INSERT INTO medical_records
            (
                patient_id,
                doctor_id,
                diagnosis,
                treatment,
                notes
            )
            VALUES($1,$2,$3,$4,$5)`,

            [
                patient_id,
                doctor_id,
                diagnosis,
                treatment,
                notes
            ]

        );

        res.json({
            success: true,
            message: "Medical Record Added Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===========================
// Get Patient Medical Records
// ===========================

const getPatientMedicalRecords = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(

            `
            SELECT

            mr.record_id,
            mr.diagnosis,
            mr.treatment,
            mr.remarks,
            mr.created_at,

            d.first_name,
            d.last_name,
            d.specialization

            FROM medical_records mr

            JOIN doctors d
            ON mr.doctor_id = d.doctor_id

            WHERE mr.patient_id = $1

            ORDER BY mr.created_at DESC
            `,

            [patient_id]

        );

        res.json({
            success: true,
            records: result.rows
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

module.exports = {
    addMedicalRecord,
    getPatientMedicalRecords
};