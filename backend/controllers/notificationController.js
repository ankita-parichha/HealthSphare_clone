const db = require("../config/db");

const getPatientNotifications = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(
        `
        SELECT *
        FROM notifications
        WHERE patient_id=$1
        ORDER BY created_at DESC
        `,
        [patient_id]
        );

        res.json({
            success: true,
            notifications: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getPatientNotifications
};