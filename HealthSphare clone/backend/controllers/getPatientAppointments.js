const getPatientAppointments = async (req, res) => {

    const { patient_id } = req.params;

    const result = await db.query(
        `SELECT
            appointment_number,
            appointment_date,
            appointment_time,
            status
         FROM appointments
         WHERE patient_id = $1
         ORDER BY appointment_date DESC`,
        [patient_id]
    );

    res.json({
        success: true,
        appointments: result.rows
    });

};