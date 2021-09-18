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

async function addEmployeeHr(employeeDetails, data) {
  const { projectId, notes } = data;
  const date = moment(data.date).format("yyyy-M-D");
  const startAt = moment(data.startAt); //.format("HH:mm");
  const endAt = moment(data.endAt); //.format("HH:mm");
  const duration = moment.duration(endAt.diff(startAt));
  const hours = parseFloat(duration.asHours()).toFixed(2);
  const payPerDay = ((employeeDetails.wagePerDay / 8.5) * hours).toFixed(2);
  const values = [
    date,
    employeeDetails.id,
    projectId,
    startAt.format("HH:mm"),
    endAt.format("HH:mm"),
    hours,
    payPerDay,
    notes,
  ];

  const addEmployeeHrQuery =
    `INSERT INTO ${process.env.DB_SCHEMA}.employeesTimeSheet (date, employeeId, projectId, startAt, endAt, duration, payPerDay,notes) VALUES (?,?,?,?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(addEmployeeHrQuery, values);
  return rows;
}

module.exports = {
  getProjectWithEmoloyeeTimeSheet,
  getEmoloyeeTimeSheet,
  addEmployeeHr,
};
