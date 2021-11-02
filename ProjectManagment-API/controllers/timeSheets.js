require("dotenv").config();
const moment = require("moment");
const connection = require("../database/index");

async function getProjectWithEmoloyeeTimeSheet(projectId) {
  const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");
  const values = [ projectId];
  const getProjectWithEmoloyeeTimeSheetQuery = `

  SELECT 
  ${process.env.DB_SCHEMA}.employeesTimeSheet.id AS id,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.date AS date,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.startAt AS startAt,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.endAt AS endAt,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.duration AS duration,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.notes AS notes,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.payPerDay AS payPerDay,
  ${process.env.DB_SCHEMA}.employee.firstName AS firstName,
  ${process.env.DB_SCHEMA}.employee.id AS employeeId,
  ${process.env.DB_SCHEMA}.employee.lastName AS lastName,
  (SELECT 
          dailywage
      FROM
      ${process.env.DB_SCHEMA}.employeeDailyWage
      WHERE
          month(startFromDate) <= month(${process.env.DB_SCHEMA}.employeesTimeSheet.date) And YEAR(startFromDate) <= YEAR(${process.env.DB_SCHEMA}.employeesTimeSheet.date)
              AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      ORDER BY startFromDate DESC
      LIMIT 1) AS dailyWage,
  (SELECT 
          startFromDate
      FROM
          ${process.env.DB_SCHEMA}.employeeDailyWage
      WHERE
          month(startFromDate) <= month(${process.env.DB_SCHEMA}.employeesTimeSheet.date) And YEAR(startFromDate) <= YEAR(${process.env.DB_SCHEMA}.employeesTimeSheet.date)
              AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      ORDER BY startFromDate DESC
      LIMIT 1) AS startFromDate,
  IFNULL(GROUP_CONCAT(DISTINCT ${process.env.DB_SCHEMA}.workedProjects.projectId
              ORDER BY (${process.env.DB_SCHEMA}.workedProjects.projectId) DESC
              SEPARATOR ','),
          0) AS dayWorkedPlace
FROM
  ${process.env.DB_SCHEMA}.employeesTimeSheet
      LEFT JOIN
  ${process.env.DB_SCHEMA}.employee ON ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId = ${process.env.DB_SCHEMA}.employee.id
      LEFT JOIN
  ${process.env.DB_SCHEMA}.employeeDailyWage ON ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      LEFT JOIN
  ${process.env.DB_SCHEMA}.workedProjects ON ${process.env.DB_SCHEMA}.workedProjects.dayId = ${process.env.DB_SCHEMA}.employeesTimeSheet.id
WHERE ${process.env.DB_SCHEMA}.workedProjects.projectId = ?
GROUP BY id 
ORDER BY date DESC   , dailyWage 


  `;


  const [rows] = await (
    await connection()
  ).execute(getProjectWithEmoloyeeTimeSheetQuery, values);
  return rows;
}

async function getEmoloyeeTimeSheet(id) {
  console.log(id);
  const getProjectWithEmoloyeeTimeSheetQuery = `
  SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet
  JOIN ${process.env.DB_SCHEMA}.employee
   On ${process.env.DB_SCHEMA}.employee.id = ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId
    where ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId =? 
ORDER BY date `;
  const [rows] = await (
    await connection()
  ).execute(getProjectWithEmoloyeeTimeSheetQuery, [id]);
  return rows;
}

async function addEmployeeRecord(record) {
  const addRecord = await Promise.all(
    record.map(async (rec) => {
      const { date, startAt, endAt, employeeId, notes } = rec;
      const duration = moment.duration(moment(endAt).diff(moment(startAt)));
      console.log('24r532fdd',parseFloat(duration.asHours()).toFixed(2))
      if (parseFloat(duration.asHours()).toFixed(2) > 4) duration.subtract(0.5, "hour");
      var hours = duration.asHours();
      const values = [
        date,
        employeeId,
        startAt,
        endAt,
        (hours = parseFloat(duration.asHours()).toFixed(2)),
        notes,
      ];
      const addRecordReuslt = await _addRecordTimeSheet(values);
      addWorkPlace(rec, addRecordReuslt);
    })
  );
  // console.log(record)
  return addRecord;
}

async function addWorkPlace(record, addRecordReuslt) {
  const records = record.projectId.map(async (projectId) => {
    await addWorkedProject(addRecordReuslt, projectId);
  });
  return records;
}

async function _addRecordTimeSheet(values) {
  const addEmployeeHrQuery = `INSERT INTO ${process.env.DB_SCHEMA}.employeesTimeSheet (date, employeeId, startAt, endAt, duration,notes) VALUES (?,?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(addEmployeeHrQuery, values);
  return rows.insertId;
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

async function getEmployeeMothRecords(employeeId, month) {
  const values = [employeeId, month];
  const query = `
  SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet where employeeId = ?
and month (date) = ?
order by date
asc`;
  const [rows] = await (await connection()).execute(query, values);
  return rows;
}

async function getAllRecordsByMonth(
  currentMonth,
  pageSize,
  currentPage,
  employeeId
) {
  console.log(employeeId);
  const limitQuery = currentPage
    ? `LIMIT ${pageSize * (currentPage - 1) + "," + pageSize}`
    : "";
  const filterByEmployee =
    employeeId != "undefined"
      ? `AND ${process.env.DB_SCHEMA}.employee.id  = ${employeeId}`
      : "";
  console.log(filterByEmployee);
  const month = moment(currentMonth).month() + 1;
  const year = moment(currentMonth).year();
  const values = [currentMonth, currentMonth, month, year];

  const query = `
  SELECT 
  ${process.env.DB_SCHEMA}.employeesTimeSheet.id AS id,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.date AS date,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.startAt AS startAt,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.endAt AS endAt,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.duration AS duration,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.notes AS notes,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.payPerDay AS payPerDay,
  ${process.env.DB_SCHEMA}.employee.firstName AS firstName,
  ${process.env.DB_SCHEMA}.employee.id AS employeeId,
  ${process.env.DB_SCHEMA}.employee.lastName AS lastName,
  (SELECT 
          dailywage
      FROM
          ${process.env.DB_SCHEMA}.employeeDailyWage
      WHERE
          startFromDate <= ?
              AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      ORDER BY startFromDate DESC
      LIMIT 1) AS dailyWage,
  (SELECT 
          startFromDate
      FROM
          ${process.env.DB_SCHEMA}.employeeDailyWage
      WHERE
          startFromDate <= ?
              AND ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      ORDER BY startFromDate DESC
      LIMIT 1) AS startFromDate,
  IFNULL(GROUP_CONCAT(DISTINCT ${process.env.DB_SCHEMA}.workedProjects.projectId
              ORDER BY (${process.env.DB_SCHEMA}.workedProjects.projectId) DESC
              SEPARATOR ','),
          0) AS dayWorkedPlace
FROM
  ${process.env.DB_SCHEMA}.employeesTimeSheet
      LEFT JOIN
  ${process.env.DB_SCHEMA}.employee ON ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId = ${process.env.DB_SCHEMA}.employee.id
      LEFT JOIN
  ${process.env.DB_SCHEMA}.employeeDailyWage ON ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id
      LEFT JOIN
  ${process.env.DB_SCHEMA}.workedProjects ON ${process.env.DB_SCHEMA}.workedProjects.dayId = ${process.env.DB_SCHEMA}.employeesTimeSheet.id
WHERE
  MONTH(date) = ? AND YEAR(date) = ? ${filterByEmployee}
GROUP BY id 
ORDER BY date DESC   , dailyWage 
${limitQuery}
  `;
  //, date , startAt , endAt , duration , payPerDay , notes , firstName , lastName , dailyWage

  console.log(currentMonth, currentMonth, month, year);

  //   `
  //   SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet where month (date) = ?
  // order by date
  // asc`;
  const [rows] = await (await connection()).execute(query, values);
  return rows;
}

async function getRecordsCount(currentMonth) {
  const month = moment(currentMonth).month() + 1;
  console.log("month", month);
  const values = [month];
  const getProjectsQuery = `SELECT count(*) as totalRecords FROM ${process.env.DB_SCHEMA}.employeesTimeSheet WHERE
  MONTH(date) = ? `;
  const [rows] = await (await connection()).execute(getProjectsQuery, values);
  return rows[0].totalRecords;
}

module.exports = {
  getProjectWithEmoloyeeTimeSheet,
  getEmoloyeeTimeSheet,
  addEmployeeRecord,
  getEmployeeMothRecords,
  getAllRecordsByMonth,
  getRecordsCount,
  addWorkedProject,
};

// SELECT
// ${process.env.DB_SCHEMA}.employeesTimeSheet.id As id,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.date As date,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.startAt As startAt,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.endAt As endAt,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.duration As duration,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.payPerDay As payPerDay,
// ${process.env.DB_SCHEMA}.employeesTimeSheet.notes As notes,
// ${process.env.DB_SCHEMA}.employee.firstName As firstName,
// ${process.env.DB_SCHEMA}.employee.lastName As lastName,
// ${process.env.DB_SCHEMA}.projects.projectName As projectName
// FROM
// ${process.env.DB_SCHEMA}.employeesTimeSheet
// left join
//     ${process.env.DB_SCHEMA}.employee
//     On ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId = ${process.env.DB_SCHEMA}.employee.id
// left join
//     ${process.env.DB_SCHEMA}.projects
//     On ${process.env.DB_SCHEMA}.employeesTimeSheet.projectId = ${process.env.DB_SCHEMA}.projects.id
// WHERE
// MONTH(date) = ?
// order by date
// desc
