const connection = require("../database/index");
const moment = require("moment");

async function getRecordById(recordId) {
  const getReocordQuery = `
  SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet
	left join 
	  ${process.env.DB_SCHEMA}.workedProjects ON ${process.env.DB_SCHEMA}.workedProjects.dayId = ${process.env.DB_SCHEMA}.employeesTimeSheet.id
where ${process.env.DB_SCHEMA}.employeesTimeSheet.id = ${recordId}
  `;
  const [rows] = await (await connection()).execute(getReocordQuery);
  return rows;
}

// editRecord(checkIfRecordExAndGetOldRecords,req.body)
async function editRecord(oldRecords, newRecords) {
  const checkIfProjectsChanged = await _checkProjectsIfChanged(
    oldRecords,
    newRecords
  );
}

async function checkProjectsIfChanged(oldRecords, newRecords) {
  const extractRemovedProjects = oldRecords.filter(
    (el) => !newRecords.projectId.includes(el.projectId)
  );
  if (extractRemovedProjects.length > 0)
    await extractRemovedProjects.map((oldProject) =>
      _deleteDailyWorkPlace(oldProject.id)
    );
  const extractNewProjects = newRecords.projectId.filter(
    (el) => !oldRecords.find((old) => old.projectId === el)
  );

  if (extractNewProjects.length > 0) {
    const newRecs = {
      ...newRecords,
      employeeId: newRecords.employeeId[0],
      projectId: extractNewProjects,
    };
    // const newRecs =await _splitProjectsId(extractNewProjects,newRecords);
    // const result = await addUpdatedRecords(newRecs);
    const records = newRecs.projectId.map(async (projectId) => {
      // console.log(newRecs, projectId)
     await addWorkedProject(newRecs.id, projectId);//dayId,projectId
    });
  }
}

async function addWorkedProject(dayId, projectId) {
  const values = [dayId, projectId];
  const addToWorkedProjectQuery = `
  INSERT INTO ${process.env.DB_SCHEMA}.workedProjects (dayId, projectId) VALUES (?, ?);
  `;
  const [rows] = await (
    await connection()
  ).execute(addToWorkedProjectQuery, values);
  return rows;
}

async function _deleteDailyWorkPlace(id) {
  const deleteQuery = `DELETE FROM ${process.env.DB_SCHEMA}.workedProjects WHERE (id = ?);`;
  const [rows] = await (await connection()).execute(deleteQuery, [id]);
  return rows.affectedRows;
}

async function _splitProjectsId(projectsIds, newRecords) {
  const records = projectsIds
    .map((projectId) => ({
      id: newRecords.id,
      date: newRecords.date,
      employeeId: newRecords.employeeId[0],
      projectId: projectId,
      startAt: newRecords.startAt,
      endAt: newRecords.endAt,
      notes: newRecords.notes,
      createdAt: newRecords.createdAt,
    }))
    .flat();
  return records;
}

async function updateRecord(data) {
  console.log(data);
  const { date, startAt, endAt, employeeId, notes, id } = data;
  const duration = moment.duration(moment(endAt).diff(moment(startAt)));
  if (parseFloat(duration.asHours()).toFixed(2) > 4)
    duration.subtract(0.5, "hour");
  var hours = duration.asHours();
  const values = [
    date,
    employeeId[0],
    startAt,
    endAt,
    (hours = parseFloat(duration.asHours()).toFixed(2)),
    notes,
    id,
  ];
  const updateEmployeeHrQuery = `UPDATE ${process.env.DB_SCHEMA}.employeesTimeSheet SET date = ?, employeeId = ?, startAt = ?, endAt = ?, duration = ?,notes = ? WHERE id = ?;`;
  const [rows] = await (
    await connection()
  ).execute(updateEmployeeHrQuery, values);
  return rows.affectedRows;
}
async function addUpdatedRecords(record) {
  const { date, startAt, endAt, employeeId, notes, id } = record;
  const duration = moment.duration(moment(endAt).diff(moment(startAt)));
  if (parseFloat(duration.asHours()).toFixed(2) > 4)
    duration.subtract(0.5, "hour");
  var hours = duration.asHours();
  const values = [
    date,
    employeeId,
    startAt,
    endAt,
    (hours = parseFloat(duration.asHours()).toFixed(2)),
    notes,
    id,
  ];
  const addRecordReuslt = await _updateRecordTimeSheet(values);
  return addWorkPlace(record, id);
}

async function addWorkPlace(record, addRecordReuslt) {
  const records = record.projectId.map(async (projectId) => {
    //
    await addWorkedProject(addRecordReuslt, projectId);
  });
  return records;
}

async function _updateRecordTimeSheet(values) {
  const updateEmployeeHrQuery = `UPDATE ${process.env.DB_SCHEMA}.employeesTimeSheet SET date = ?, employeeId = ?, startAt = ?, endAt = ?, duration = ?,notes = ? WHERE id = ?;`;
  const [rows] = await (
    await connection()
  ).execute(updateEmployeeHrQuery, values);
  return rows.affectedRows;
}

async function deleteRecordById(recordId) {
  const deleteQuery = "DELETE FROM employeesTimeSheet WHERE (id = ?);";
  const [rows] = await (await connection()).execute(deleteQuery, [recordId]);
  return rows.affectedRows;
}

// async function _editecordTimeSheet(values) {
//   const addEmployeeHrQuery = `INSERT INTO ${process.env.DB_SCHEMA}.employeesTimeSheet (date, employeeId, startAt, endAt, duration,notes) VALUES (?,?,?,?,?,?);`;
//   const [rows] = await (await connection()).execute(addEmployeeHrQuery, values);
//   return rows.insertId;
// }

// async function editWorkedProject(dayId, projectId) {
//   const values = [dayId, projectId];
//   const addToWorkedProjectQuery = `
//   INSERT INTO ${process.env.DB_SCHEMA}.workedProjects (dayId, projectId) VALUES (?, ?);
//   `;
//   const [rows] = await (
//     await connection()
//   ).execute(addToWorkedProjectQuery, values);
//   return rows;
// }

// async function getEmployeeMothRecords(employeeId, month) {
//   const values = [employeeId, month];
//   const query = `
//   SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet where employeeId = ?
// and month (date) = ?
// order by date
// asc`;
//   const [rows] = await (await connection()).execute(query, values);
//   return rows;
// }

// async function getAllRecordsByMonth(
//   currentMonth,
//   pageSize,
//   currentPage,
//   employeeId
// ) {
//   console.log(employeeId);
//   const limitQuery = currentPage
//     ? `LIMIT ${pageSize * (currentPage - 1) + "," + pageSize}`
//     : "";
//   const filterByEmployee =
//     employeeId != "undefined"
//       ? `AND ${process.env.DB_SCHEMA}.employee.id  = ${employeeId}`
//       : "";
//   console.log(filterByEmployee);
//   const month = moment(currentMonth).month() + 1;
//   const year = moment(currentMonth).year();
//   const values = [currentMonth, currentMonth, month, year];

//   const query = `
//   SELECT
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.id AS id,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.date AS date,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.startAt AS startAt,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.endAt AS endAt,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.duration AS duration,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.notes AS notes,
//   ${process.env.DB_SCHEMA}.employeesTimeSheet.payPerDay AS payPerDay,
//   ${process.env.DB_SCHEMA}.employee.firstName AS firstName,
//   ${process.env.DB_SCHEMA}.employee.id AS employeeId,
//   ${process.env.DB_SCHEMA}.employee.lastName AS lastName,
//   (SELECT
//           dailywage
//       FROM
//           ${process.env.DB_SCHEMA}.employeeDailyWage
//       WHERE
//           startFromDate <= ?
//               AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
//       ORDER BY startFromDate DESC
//       LIMIT 1) AS dailyWage,
//   (SELECT
//           startFromDate
//       FROM
//           ${process.env.DB_SCHEMA}.employeeDailyWage
//       WHERE
//           startFromDate <= ?
//               AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
//       ORDER BY startFromDate DESC
//       LIMIT 1) AS startFromDate,
//   IFNULL(GROUP_CONCAT(DISTINCT ${process.env.DB_SCHEMA}.workedProjects.projectId
//               ORDER BY (${process.env.DB_SCHEMA}.workedProjects.projectId) DESC
//               SEPARATOR ','),
//           0) AS dayWorkedPlace
// FROM
//   ${process.env.DB_SCHEMA}.employeesTimeSheet
//       LEFT JOIN
//   ${process.env.DB_SCHEMA}.employee ON ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId = ${process.env.DB_SCHEMA}.employee.id
//       LEFT JOIN
//   ${process.env.DB_SCHEMA}.employeeDailyWage ON ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
//       LEFT JOIN
//   ${process.env.DB_SCHEMA}.workedProjects ON ${process.env.DB_SCHEMA}.workedProjects.dayId = ${process.env.DB_SCHEMA}.employeesTimeSheet.id
// WHERE
//   MONTH(date) = ? AND YEAR(date) = ? ${filterByEmployee}
// GROUP BY id
// ORDER BY date DESC   , dailyWage
// ${limitQuery}
//   `;
//   //, date , startAt , endAt , duration , payPerDay , notes , firstName , lastName , dailyWage

//   console.log(currentMonth, currentMonth, month, year);

//   //   `
//   //   SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet where month (date) = ?
//   // order by date
//   // asc`;
//   const [rows] = await (await connection()).execute(query, values);
//   return rows;
// }

// async function getRecordsCount(currentMonth) {
//   const month = moment(currentMonth).month() + 1;
//   console.log("month", month);
//   const values = [month];
//   const getProjectsQuery = `SELECT count(*) as totalRecords FROM ${process.env.DB_SCHEMA}.employeesTimeSheet WHERE
//   MONTH(date) = ? `;
//   const [rows] = await (await connection()).execute(getProjectsQuery, values);
//   return rows[0].totalRecords;
// }

// async function deleteProjectById(projectId) {
//   const deleteQuery = "DELETE FROM projects WHERE (id = ?);";
//   const [rows] = await (await connection()).execute(deleteQuery, [projectId]);
//   return rows.affectedRows;
// }

module.exports = {
  // deleteProjectById,
  updateRecord,
  getRecordById,
  checkProjectsIfChanged,
  deleteRecordById
};
