const db = require("../config/db");
const bcrypt = require("bcrypt");
// ==========================
// Register Patient
// ==========================

const registerPatient = async (req, res) => {

try{

const{

full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
password

}=req.body;

const checkUser=await db.query(

"SELECT * FROM users WHERE email=$1",

[email]

);

if(checkUser.rows.length>0){

return res.status(400).json({

success:false,

message:"Email already exists"

});

}

const hashedPassword=
await bcrypt.hash(password,10);

const userResult=await db.query(

`INSERT INTO users
(full_name,email,password,role)
VALUES($1,$2,$3,$4)
RETURNING user_id`,

[
full_name,
email,
hashedPassword,
"Patient"
]

);

const userId=userResult.rows[0].user_id;

const patientCode=
"PAT"+String(userId).padStart(4,"0");

await db.query(

`INSERT INTO patients(

user_id,
patient_code,
full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
status

)

VALUES(

$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11

)`,

[
userId,
patientCode,
full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
"Active"
]

);

res.json({

success:true,

message:"Patient Registered Successfully"

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
// ==========================
// Get All Patients
// ==========================

const getPatients = async (req, res) => {

try{

const result = await db.query(

`SELECT

patient_id,
patient_code,
full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
status

FROM patients

ORDER BY patient_id`

);

res.json({

success:true,

patients:result.rows

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
// Update Patient
// ==========================

const updatePatient = async (req, res) => {

try{

const { patientId } = req.params;

const{

full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
status

}=req.body;

await db.query(

`UPDATE patients

SET

full_name=$1,
gender=$2,
phone=$3,
email=$4,
address=$5,
city=$6,
state=$7,
pincode=$8,
status=$9

WHERE patient_id=$10`,

[
full_name,
gender,
phone,
email,
address,
city,
state,
pincode,
status,
patientId
]

);

// Update users table also

await db.query(

`UPDATE users

SET

full_name=$1,
email=$2

WHERE user_id=(

SELECT user_id

FROM patients

WHERE patient_id=$3

)`,

[
full_name,
email,
patientId
]

);

res.json({

success:true,

message:"Patient Updated Successfully"

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

};
// ==========================
// Delete Patient
// ==========================

// ==========================
// Delete Patient
// ==========================

const deletePatient = async (req, res) => {

try{

const { patientId } = req.params;

// Get User ID

const patient = await db.query(

"SELECT user_id FROM patients WHERE patient_id=$1",

[patientId]

);

if(patient.rows.length===0){

return res.status(404).json({

success:false,

message:"Patient Not Found"

});

}

// Delete Patient

await db.query(

"DELETE FROM patients WHERE patient_id=$1",

[patientId]

);

// Delete User

await db.query(

"DELETE FROM users WHERE user_id=$1",

[patient.rows[0].user_id]

);

res.json({

success:true,

message:"Patient Deleted Successfully"

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
// =============================
// Get Patient By ID
// =============================
const getPatientById = async (req, res) => {

    try {

        const { patientId } = req.params;

        const result = await db.query(
            `SELECT
                patient_id,
                patient_code,
                full_name,
                age,
                gender,
                blood_group,
                phone,
                email
             FROM patients
             WHERE patient_id = $1`,
            [patientId]
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

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = {

registerPatient,
getPatients,
updatePatient,
deletePatient,
getPatientById

};