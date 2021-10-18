const connection = require("../database/index");

async function getEmployeeById(employeeId) {
  const getEmployeeQuery = `
SELECT ${process.env.DB_SCHEMA}.employee.id,
  ${process.env.DB_SCHEMA}.employee.firstName,
  ${process.env.DB_SCHEMA}.employee.lastName,
  ${process.env.DB_SCHEMA}.employee.phone,
  ${process.env.DB_SCHEMA}.employee.bankBranch,
  ${process.env.DB_SCHEMA}.employee.createdAt,
  ${process.env.DB_SCHEMA}.employee.updatedAt,
  ${process.env.DB_SCHEMA}.employeeDailyWage.dailyWage
 FROM ${process.env.DB_SCHEMA}.employee 
 left join ${process.env.DB_SCHEMA}.employeeDailyWage
 on ${process.env.DB_SCHEMA}.employeeDailyWage.employeeId = ${process.env.DB_SCHEMA}.employee.id 
 where ${process.env.DB_SCHEMA}.employee.id = ?
  order by ${process.env.DB_SCHEMA}.employeeDailyWage.dailyWage
desc
LIMIT 1
  `;
  const [rows] = await (
    await connection()
  ).execute(getEmployeeQuery, [employeeId]);
  console.log(rows)
  return rows[0];
}
async function createEmployee(employeeValues) {
  const { firstName, lastName, phone, wagePerDay, bankAccount, bankBranch } =
    employeeValues;
  const values = [firstName, lastName, phone, bankAccount, bankBranch];

  const createProjectQuery = `INSERT INTO ${process.env.DB_SCHEMA}.employee (firstName, lastName, phone, bankAccount,bankBranch) VALUES (?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(createProjectQuery, values);
  return rows.insertId;
}

async function addDailyWage(employeeId, dailyWage, startFrom) {
  const values = [employeeId, dailyWage, startFrom];
  const insertDailyWage = `INSERT INTO ${process.env.DB_SCHEMA}.employeeDailyWage (employeeId, dailyWage,startFromDate) VALUES (?,?,?);`;
  const [rows] = await (await connection()).execute(insertDailyWage, values);
  return rows;
}

async function getEmployees(pageSize, currentPage) {
  const limitQuery = currentPage
    ? `LIMIT ${pageSize * (currentPage - 1) + "," + pageSize}`
    : "";
  const getEmployeeQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.employee ${limitQuery};`;
  const [rows] = await (await connection()).execute(getEmployeeQuery);
  return rows;
}

async function getEmployeesCount() {
  const getEmployeesQuery = `SELECT count(*) as totalEmployees FROM ${process.env.DB_SCHEMA}.employee `;
  const [rows] = await (await connection()).execute(getEmployeesQuery);
  return rows[0].totalEmployees;
}

async function editEmployee(employeeValues, employeeId) {
  const { firstName, lastName, phone, wagePerDay, bankAccount, bankBranch } =
    employeeValues;
  const values = [
    firstName,
    lastName,
    phone,
    wagePerDay,
    bankAccount,
    bankBranch,
    employeeId,
  ];
  const updateQuery =
    "UPDATE `employee` SET `firstName` = ?, `lastName` = ?, `phone` = ?, `wagePerDay` = ?, `bankAccount` = ? , `bankBranch` = ? WHERE (`id` = ?);  ";
  const [rows] = await (await connection()).execute(updateQuery, values);
  return rows;
}

async function deleteEmployeeById(employeeId) {
  const deleteQuery = "DELETE FROM employee WHERE (id = ?);";
  const [rows] = await (await connection()).execute(deleteQuery, [employeeId]);
  return rows.affectedRows;
}
async function createAccount(account) {
  const createAccountQuery = `INSERT INTO ${process.env.DB_SCHEMA}.accounts (id, type) VALUES (?,?)`;
  const [rows] = await (
    await connection()
  ).execute(createAccountQuery, [account.id, account.type]);
  return rows;
}

async function createAccountUser(accountId, userId, accountRole) {
  const createAccountQuery = `INSERT INTO ${process.env.DB_SCHEMA}.accounts_users (accountId, userId, accountRole) VALUES(?,?,?)`;
  const [rows] = await (
    await connection()
  ).execute(createAccountQuery, [accountId, userId, accountRole]);
  return rows;
}

async function getAccountById(accountId) {
  const getAccountsQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.accounts where ${process.env.DB_SCHEMA}.accounts.id = ?`;
  const [rows] = await (
    await connection()
  ).execute(getAccountsQuery, [accountId]);
  return rows[0];
}

async function getAccounts(userId) {
  const whereUserId = userId
    ? `where ${process.env.DB_SCHEMA}.users.id = ? `
    : "";
  const params = userId ? [userId] : [];
  const getAccountsQuery = `SELECT 
    accountId, email, firstName, accounts.createdAt
        FROM
    ${process.env.DB_SCHEMA}.accounts
        JOIN
    ${process.env.DB_SCHEMA}.accounts_users ON ${process.env.DB_SCHEMA}.accounts.id = ${process.env.DB_SCHEMA}.accounts_users.accountId
         JOIN
    ${process.env.DB_SCHEMA}.users ON ${process.env.DB_SCHEMA}.users.id = ${process.env.DB_SCHEMA}.accounts_users.userId ${whereUserId} order by accounts.createdAt desc`;
  const [rows] = await (await connection()).execute(getAccountsQuery, params);
  return rows;
}

module.exports = {
  // createAccount,
  // createAccountUser,
  // getAccounts,
  // getAccountById,
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeesCount,
  deleteEmployeeById,
  editEmployee,
  addDailyWage,
};
