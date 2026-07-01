const db = require("../config/db");

// ===========================
// Get All Departments
// ===========================

const getDepartments = async (req, res) => {

try{

const result = await db.query(

`SELECT
department_id,
department_name,
department_head,
location,
description
FROM departments
ORDER BY department_id`

);

res.json({

success:true,
departments:result.rows

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,
message:error.message

});

}

};
// ===========================
// Register Department
// ===========================

const registerDepartment = async (req, res) => {

try{

const{

department_name,
department_head,
location,
description

}=req.body;

await db.query(

`INSERT INTO departments(

department_name,
department_head,
location,
description

)

VALUES($1,$2,$3,$4)`,

[
department_name,
department_head,
location,
description
]

);

res.json({

success:true,
message:"Department Added Successfully"

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,
message:error.message

});

}

};
// ===========================
// Update Department
// ===========================

const updateDepartment = async (req, res) => {

try{

const { departmentId } = req.params;

const{

department_name,
department_head,
location,
description

}=req.body;

await db.query(

`UPDATE departments

SET

department_name=$1,
department_head=$2,
location=$3,
description=$4

WHERE department_id=$5`,

[
department_name,
department_head,
location,
description,
departmentId
]

);

res.json({

success:true,
message:"Department Updated Successfully"

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,
message:error.message

});

}

};
// ===========================
// Delete Department
// ===========================

const deleteDepartment = async (req, res) => {

try{

const { departmentId } = req.params;

await db.query(

"DELETE FROM departments WHERE department_id=$1",

[departmentId]

);

res.json({

success:true,
message:"Department Deleted Successfully"

});

}catch(error){

console.log(error);

res.status(500).json({

success:false,
message:error.message

});

}

};
module.exports = {

getDepartments,
registerDepartment,
updateDepartment,
deleteDepartment

};