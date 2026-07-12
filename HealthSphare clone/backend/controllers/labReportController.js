const db = require("../config/db");

const getPatientLabReports = async (req, res) => {

    try {

        const { patient_id } = req.params;

        const result = await db.query(
            `
            SELECT
                report_id,
                test_name,
                test_result,
                normal_range,
                report_date,
                remarks
            FROM lab_reports
            WHERE patient_id = $1
            ORDER BY report_date DESC
            `,
            [patient_id]
        );

        res.json({
            success: true,
            reports: result.rows
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
    getPatientLabReports
};