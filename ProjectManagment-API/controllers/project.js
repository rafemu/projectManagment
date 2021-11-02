const connection = require("../database/index");
const fs = require("fs");

async function createProject(project) {
  const { projectName, clientFullName, clientPhone, location, createdAt } =
    project;
  const values = [
    projectName,
    clientFullName,
    clientPhone,
    location,
    createdAt,
  ];
  const createProjectQuery = `INSERT INTO ${process.env.DB_SCHEMA}.projects (projectName,clientFullName,clientPhone, location,createdAt) VALUES (?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(createProjectQuery, values);
  return rows.insertId;
}

async function insertQuotationForProject(projectId, quotation) {
  const values = [projectId, quotation];
  const inserQuotationQuery = `INSERT INTO ${process.env.DB_SCHEMA}.project_quotation  (projectId, quotation) VALUES (?, ?);`;
  const [rows] = await (
    await connection()
  ).execute(inserQuotationQuery, values);
  return rows;
}

async function insertPaidsForProject(projectId, paid) {
  const values = [projectId, paid];
  const inserQuotationQuery = `INSERT INTO ${process.env.DB_SCHEMA}.project_pays  (projectId, paid) VALUES (?, ?);`;
  const [rows] = await (
    await connection()
  ).execute(inserQuotationQuery, values);
  return rows;
}

async function editProject(updatedData, projectId) {
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
    projectId,
  ];
  const updateQuery =
    "UPDATE `projects` SET `projectName` = ?, `clientFullName` = ?, `clientPhone` = ?, `location` = ?, `quotation` = ? , `paid` = ?, `unPaid` = ? ,`haregem` = ? ,`createdAt` = ? WHERE (`id` = ?);  ";
  const [rows] = await (await connection()).execute(updateQuery, values);
  return rows.affectedRows;
}

function _deleteAgreementFromStorage(imgPath) {
  const filePath = imgPath;
  if (fs.existsSync(filePath)) {
    const deleteImage = fs.unlinkSync(filePath);
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
  const getProjectsQuery = `SELECT 
  projects.id As id,
  projects.projectName as projectName,
  projects.clientFullName as clientFullName,
  projects.clientPhone as clientPhone,
  projects.location as location,
  projects.createdAt as createdAt,
  projects.updatedAt as updatedAt,
  agreement.imagePath as agreement,
  project_quotation.quotation as quotation,
  project_pays.paid as paid
FROM
${process.env.DB_SCHEMA}.projects
      LEFT JOIN
       ${process.env.DB_SCHEMA}.agreement ON projects.id = ${process.env.DB_SCHEMA}.agreement.projectId
       LEFT JOIN 
       ${process.env.DB_SCHEMA}.project_quotation ON projects.id = ${process.env.DB_SCHEMA}.project_quotation.projectId
       LEFT JOIN 
       ${process.env.DB_SCHEMA}.project_pays ON projects.id = ${process.env.DB_SCHEMA}.project_pays.projectId
       ${limitQuery}
  `;
  const [rows] = await (await connection()).execute(getProjectsQuery);
  return rows;
}

async function getProjectsCount() {
  const getProjectsQuery = `SELECT count(*) as totalProjects FROM ${process.env.DB_SCHEMA}.projects `;
  const [rows] = await (await connection()).execute(getProjectsQuery);
  return rows[0].totalProjects;
}

async function getAgreementByProjectId(projectId) {
  const getAgreementByProjectIdQuery = `SELECT *
  FROM agreement 
  where projectId = ?`;
  const [rows] = await (
    await connection()
  ).execute(getAgreementByProjectIdQuery, [projectId]);
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
  const [rows] = await (
    await connection()
  ).execute(PhotoQuery, [filePath, projectId]);
  return rows.affectedRows;
}

async function getProjectById(projectId) {
  const getProjectQuery = `SELECT 
  ${process.env.DB_SCHEMA}.projects.id As id,
  ${process.env.DB_SCHEMA}.projects.projectName as projectName,
  ${process.env.DB_SCHEMA}.projects.clientFullName as clientFullName,
  ${process.env.DB_SCHEMA}.projects.clientPhone as clientPhone,
  ${process.env.DB_SCHEMA}.projects.location as location,
  ${process.env.DB_SCHEMA}.projects.createdAt as createdAt,
  ${process.env.DB_SCHEMA}.projects.updatedAt as updatedAt,
  ${process.env.DB_SCHEMA}.agreement.imagePath as agreement,
  ${process.env.DB_SCHEMA}.project_quotation.quotation as quotation,
  ${process.env.DB_SCHEMA}.project_pays.paid as paid
FROM
${process.env.DB_SCHEMA}.projects  
      LEFT JOIN
       ${process.env.DB_SCHEMA}.agreement ON ${process.env.DB_SCHEMA}.projects.id = ${process.env.DB_SCHEMA}.agreement.projectId
      LEFT JOIN
       ${process.env.DB_SCHEMA}.project_quotation ON projects.id = ${process.env.DB_SCHEMA}.project_quotation.projectId
      LEFT JOIN 
       ${process.env.DB_SCHEMA}.project_pays ON projects.id = ${process.env.DB_SCHEMA}.project_pays.projectId
      where projects.id = ?`;
  const [rows] = await (
    await connection()
  ).execute(getProjectQuery, [projectId]);
  return rows[0];
}

async function getProjectPaids(id){
  
  const values = [id]
  const getPaidsQuery = `
  SELECT * FROM ${process.env.DB_SCHEMA}.project_pays
  where projectId = ?
  `;
  const [rows] = await (await connection()).execute(getPaidsQuery,values);
  return rows;

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
  insertQuotationForProject,
  insertPaidsForProject,
  editProject,
  getAgreementByProjectId,
  getProjectPaids,
  _deleteAgreementFromStorage,
  getProjects,
  getProjectById,
  getProjectsCount,
  deleteProjectById,
  insertPhotoToDB,
  updatePhotoToDB,
};
