const db = require("../config/db");

const getPatientBills = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(
        `
        SELECT
            b.bill_id,
            b.bill_number,
            b.amount,
            b.payment_status,
            d.first_name,
            d.last_name,
            a.appointment_date

        FROM bills b

        JOIN doctors d
        ON b.doctor_id = d.doctor_id

        JOIN appointments a
        ON b.appointment_id = a.appointment_id

        WHERE b.patient_id = $1

        ORDER BY b.created_at DESC
        `,
        [patient_id]
        );

        res.json({
            success: true,
            bills: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const payBill = async (req, res) => {

    try {

        const { bill_id } = req.params;

        await db.query(

            `UPDATE bills
             SET payment_status='Paid',
                 payment_method='Online',
                 payment_date=NOW()
             WHERE bill_id=$1`,

            [bill_id]

        );

        res.json({
            success: true,
            message: "Payment Successful"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getAllBills = async (req, res) => {

    try {

        const result = await db.query(

            `SELECT

                b.bill_id,
                b.bill_number,
                p.full_name,
                b.amount,
                b.payment_status,
                b.created_at

             FROM bills b

             JOIN patients p
             ON b.patient_id = p.patient_id

             ORDER BY b.created_at DESC`

        );

        res.json({
            success: true,
            bills: result.rows
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
    getPatientBills,
    payBill,
    getAllBills
};