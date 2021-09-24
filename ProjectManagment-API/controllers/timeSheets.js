require("dotenv").config();
const moment = require("moment");
const connection = require("../database/index");

async function getProjectWithEmoloyeeTimeSheet(projectId) {
  const getProjectWithEmoloyeeTimeSheetQuery = `SELECT 
  ${process.env.DB_SCHEMA}.employeesTimeSheet.date AS 'date',
  CONCAT(${process.env.DB_SCHEMA}.employee.firstName,
          ' ',
          ${process.env.DB_SCHEMA}.employee.lastName) AS employeeName,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.startAt,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.endAt,
  ROUND(TIMESTAMPDIFF(MINUTE, startAt, endAt) / 60,
          2) AS 'hours',
  ${process.env.DB_SCHEMA}.employee.wagePerDay AS wagePerDay,
  ${process.env.DB_SCHEMA}.employeesTimeSheet.notes
FROM
  ${process.env.DB_SCHEMA}.employeesTimeSheet
      JOIN
  ${process.env.DB_SCHEMA}.employee ON ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId = ${process.env.DB_SCHEMA}.employee.id
      JOIN
  ${process.env.DB_SCHEMA}.projects ON ${process.env.DB_SCHEMA}.employeesTimeSheet.projectId = ${process.env.DB_SCHEMA}.projects.id
  WHERE ${process.env.DB_SCHEMA}.projects.id = ? 
ORDER BY date `;
  const [rows] = await (
    await connection()
  ).execute(getProjectWithEmoloyeeTimeSheetQuery, [projectId]);
  return rows;
}

async function getEmoloyeeTimeSheet(id) {
  const getProjectWithEmoloyeeTimeSheetQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.employeesTimeSheet
  JOIN ${process.env.DB_SCHEMA}.employee On ${process.env.DB_SCHEMA}.employee.id = ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId where ${process.env.DB_SCHEMA}.employeesTimeSheet.employeeId =? 
ORDER BY date `;
  const [rows] = await (
    await connection()
  ).execute(getProjectWithEmoloyeeTimeSheetQuery, [id]);
  return rows;
}

async function addEmployeeRecord(record) {
  record.map(async (rec) => {
    const { date, startAt, endAt, employeeId, projectId, notes, payPerDay } =
      rec;
    const duration = moment.duration(moment(endAt).diff(moment(startAt)));
    var hours = duration.asHours();
    const dailyWageFixed = ((payPerDay / 9) * hours).toFixed(2);

    const values = [
      date,
      employeeId,
      projectId,
      startAt,
      endAt,
      (hours = parseFloat(duration.asHours()).toFixed(2)),
      // dailyWageFixed,
      notes,
    ];
console.log({
  'date':date,
      'employeeId':employeeId,
      'projectId':projectId,
      'startAt':startAt,
      'endAt':endAt,
      'hours':(hours = parseFloat(duration.asHours()).toFixed(2)),
      'notes':notes,
})
    const addEmployeeHrQuery = `INSERT INTO ${process.env.DB_SCHEMA}.employeesTimeSheet (date, employeeId, projectId, startAt, endAt, duration,notes) VALUES (?,?,?,?,?,?,?);`;
    const [rows] = await (
      await connection()
    ).execute(addEmployeeHrQuery, values);
    return rows;
  });
  return record;
}

module.exports = {
  getProjectWithEmoloyeeTimeSheet,
  getEmoloyeeTimeSheet,
  addEmployeeRecord,
};
