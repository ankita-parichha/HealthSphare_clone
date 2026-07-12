const db = require("../config/db");

const addPrescription = async (req, res) => {

    try {

        const {
            patient_id,
            doctor_id,
            medicines,
            dosage,
            instructions,
            next_visit
        } = req.body;

        await db.query(

            `INSERT INTO prescriptions
            (
                patient_id,
                doctor_id,
                medicines,
                dosage,
                instructions,
                next_visit
            )
            VALUES($1,$2,$3,$4,$5,$6)`,

            [
                patient_id,
                doctor_id,
                medicines,
                dosage,
                instructions,
                next_visit
            ]

        );

        res.json({
            success: true,
            message: "Prescription Added Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getPatientPrescriptions = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(

`
SELECT

p.prescription_id,
p.medicines,
p.dosage,
p.instructions,
p.next_visit,
p.created_at,

d.first_name,
d.last_name,
d.specialization

FROM prescriptions p

JOIN doctors d
ON p.doctor_id = d.doctor_id

WHERE p.patient_id = $1

ORDER BY p.created_at DESC

`,

[patient_id]

);
        res.json({

            success:true,
            prescriptions:result.rows

        });

    } catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};
const getDoctorPrescriptions = async (req, res) => {

    try {

        const { doctor_id } = req.params;

        const result = await db.query(

            `SELECT

                p.prescription_id,
                pt.full_name,
                p.medicines,
                p.dosage,
                p.instructions,
                p.next_visit,
                p.created_at

            FROM prescriptions p

            JOIN patients pt
            ON p.patient_id = pt.patient_id

            WHERE p.doctor_id = $1

            ORDER BY p.created_at DESC`,

            [doctor_id]

        );

        res.json({

            success: true,
            prescriptions: result.rows

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
    addPrescription,
    getPatientPrescriptions,
    getDoctorPrescriptions
};