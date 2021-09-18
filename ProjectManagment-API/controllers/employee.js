const connection = require("../database/index");

async function getEmployeeById(employeeId) {
  const getEmployeeQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.employee where ${process.env.DB_SCHEMA}.employee.id = ?`;
  const [rows] = await (
    await connection()
  ).execute(getEmployeeQuery, [employeeId]);
  return rows[0];
}
async function createEmployee(employeeValues) {
  const { firstName, lastName, phone, wagePerDay, bankAccount, bankBranch } =
    employeeValues;
  const values = [
    firstName,
    lastName,
    phone,
    wagePerDay,
    bankAccount,
    bankBranch,
  ];

  const createProjectQuery = `INSERT INTO ${process.env.DB_SCHEMA}.employee (firstName, lastName, phone, wagePerDay, bankAccount,bankBranch) VALUES (?,?,?,?,?,?);`;
  const [rows] = await (await connection()).execute(createProjectQuery, values);
  return rows;
}

async function getEmployees(pageSize, currentPage) {
  const limitQuery = currentPage
    ? `LIMIT ${pageSize * (currentPage - 1) + "," + pageSize}`
    : "";
    console.log(limitQuery)
  const getEmployeeQuery = `SELECT * FROM ${process.env.DB_SCHEMA}.employee ${limitQuery};`;
  const [rows] = await (await connection()).execute(getEmployeeQuery);
  console.log('getEmployees',rows)
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
  return rows.affectedRows;
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
};
