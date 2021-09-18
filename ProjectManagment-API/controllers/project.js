const connection = require("../database/index");
const fs = require("fs");

async function createProject(project) {
  const {
    projectName,
    clientFullName,
    clientPhone,
    location,
    quotation,
    paid,
    unPaid = quotation - paid,
    haregem = null,
    createdAt,
  } = project;
  const values = [
    projectName,
    clientFullName,
    clientPhone,
    location,
    quotation,
    paid,
    unPaid,
    haregem,
    createdAt,
  ];
  const createProjectQuery = `INSERT INTO ${process.env.DB_SCHEMA}.projects (projectName,clientFullName,clientPhone, location, quotation, paid,unPaid,haregem,createdAt) VALUES (?,?,?,?,?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(createProjectQuery, values);
  return rows.insertId;
}

async function editProject(updatedData,projectId){
  const {
    projectName,
    clientFullName,
    clientPhone,
    location,
    quotation,
    paid,
    unPaid = quotation - paid,
    haregem = null,
    createdAt,
  } = updatedData;
  const values = [
    projectName,
    clientFullName,
    clientPhone,
    location,
    quotation,
    paid,
    unPaid,
    haregem,
    createdAt,
    projectId
  ];
  const updateQuery =
    "UPDATE `projects` SET `projectName` = ?, `clientFullName` = ?, `clientPhone` = ?, `location` = ?, `quotation` = ? , `paid` = ?, `unPaid` = ? ,`haregem` = ? ,`createdAt` = ? WHERE (`id` = ?);  ";
  const [rows] = await (await connection()).execute(updateQuery, values);
  return rows.affectedRows;
}

function _deleteAgreementFromStorage(imgPath){
  const filePath = imgPath;
  console.log('filePath',filePath)
  if (fs.existsSync(filePath)) {
    const deleteImage = fs.unlinkSync(filePath);
    console.log(deleteImage)
  }
  return true;
}

async function deleteProjectById(projectId) {
  const deleteQuery = "DELETE FROM projects WHERE (id = ?);";
  const [rows] = await (await connection()).execute(deleteQuery, [projectId]);
  return rows.affectedRows;
}

async function getProjects(pageSize, currentPage) {
  const limitQuery = currentPage
    ? `LIMIT ${pageSize * (currentPage - 1) + "," + pageSize}`
    : "";
  // const getProjectsQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.projects ${limitQuery} `;

  const getProjectsQuery = `SELECT 
  projects.id As id,
  projects.projectName as projectName,
  projects.clientFullName as clientFullName,
  projects.clientPhone as clientPhone,
  projects.location as location,
  projects.quotation as quotation,
  projects.paid as paid,
  projects.unPaid as unPaid,
  projects.haregem as haregem,
  projects.createdAt as createdAt,
  projects.updatedAt as updatedAt,
  agreement.imagePath as agreement
FROM
${process.env.DB_SCHEMA}.projects
      LEFT JOIN
       ${process.env.DB_SCHEMA}.agreement ON projects.id = ${process.env.DB_SCHEMA}.agreement.projectId
       ${limitQuery}
  `
  const [rows] = await (await connection()).execute(getProjectsQuery);
  console.log('projects',rows)
  return rows;
}

async function getProjectsCount() {
  const getProjectsQuery = `SELECT count(*) as totalProjects FROM ${process.env.DB_SCHEMA}.projects `;
  const [rows] = await (await connection()).execute(getProjectsQuery);
  return rows[0].totalProjects;
}

async function getAgreementByProjectId(projectId){
  const getAgreementByProjectIdQuery = `SELECT *
  FROM agreement 
  where projectId = ?`;
const [rows] = await (await connection()).execute(getAgreementByProjectIdQuery, [
  projectId,
]);
return rows[0].imagePath;
}

async function deleteProjectById(projectId) {
  const deleteQuery = "DELETE FROM projects WHERE (id = ?);";
  const [rows] = await (await connection()).execute(deleteQuery, [projectId]);
  return rows.affectedRows;
}


async function insertPhotoToDB(filePath, id) {
  const PhotoQuery =
    "INSERT INTO `agreement`  (`imagePath`,`projectId`) VALUES (?,?)";
  const [rows] = await (await connection()).execute(PhotoQuery, [filePath, id]);
  return rows.affectedRows;
}

async function updatePhotoToDB(filePath, projectId) {
  const PhotoQuery =
    "UPDATE agreement SET `imagePath` = ? WHERE (`projectId` =?);";
  const [rows] = await (await connection()).execute(PhotoQuery, [
    filePath,
    projectId,
  ]);
  return rows.affectedRows;
}

async function getProjectById(projectId) {
  // const getProjectQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.projects left join agreement on agreement.projectId = projects.id where id = ?  `;
  const getProjectQuery = `SELECT 
  ${process.env.DB_SCHEMA}.projects.id As id,
  ${process.env.DB_SCHEMA}.projects.projectName as projectName,
  ${process.env.DB_SCHEMA}.projects.clientFullName as clientFullName,
  ${process.env.DB_SCHEMA}.projects.clientPhone as clientPhone,
  ${process.env.DB_SCHEMA}.projects.location as location,
  ${process.env.DB_SCHEMA}.projects.quotation as quotation,
  ${process.env.DB_SCHEMA}.projects.paid as paid,
  ${process.env.DB_SCHEMA}.projects.unPaid as unPaid,
  ${process.env.DB_SCHEMA}.projects.haregem as haregem,
  ${process.env.DB_SCHEMA}.projects.createdAt as createdAt,
  ${process.env.DB_SCHEMA}.projects.updatedAt as updatedAt,
  ${process.env.DB_SCHEMA}.agreement.imagePath as agreement
FROM
${process.env.DB_SCHEMA}.projects
      LEFT JOIN
       ${process.env.DB_SCHEMA}.agreement ON ${process.env.DB_SCHEMA}.projects.id = ${process.env.DB_SCHEMA}.agreement.projectId
       where projects.id = ?`
  const [rows] = await (
    await connection()
  ).execute(getProjectQuery, [projectId]);
  return rows[0];
}

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
  return rows[0];
}


module.exports = {
  createProject,
  editProject,
  getAgreementByProjectId,
  _deleteAgreementFromStorage,
  getProjects,
  getProjectById,
  getProjectsCount,
  deleteProjectById,
  insertPhotoToDB,
  updatePhotoToDB
};