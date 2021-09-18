const connection = require("../database/index")

async function createAccount(account) {
    const createAccountQuery = "INSERT INTO `bank_db`.`accounts` (`id`, `type`) VALUES (?,?)"
    const [rows] = await (await connection()).execute(createAccountQuery, [account.id, account.type])
    return rows
}




async function createAccountUser(accountId, userId, accountRole) {
    const createAccountQuery = "INSERT INTO `bank_db`.`accounts_users` (`accountId`, `userId`, `accountRole`) VALUES(?,?,?)"
    const [rows] = await (await connection()).execute(createAccountQuery, [accountId, userId, accountRole])
    return rows
}


async function getAccountById(accountId) {
    const getAccountsQuery = `SELECT * FROM bank_db.accounts where bank_db.accounts.id = ?`;
    const [rows] = await (await connection()).execute(getAccountsQuery, [accountId]);
    return rows[0]
}


async function getAccounts(userId) {
    const whereUserId = userId ? " where bank_db.users.id = ? " : ""
    const params = userId ? [userId] : []
    const getAccountsQuery = `SELECT 
    accountId, email, firstName, accounts.createdAt
        FROM
    bank_db.accounts
        JOIN
    bank_db.accounts_users ON bank_db.accounts.id = bank_db.accounts_users.accountId
         JOIN
    bank_db.users ON bank_db.users.id = bank_db.accounts_users.userId ${whereUserId} order by accounts.createdAt desc`;
    const [rows] = await (await connection()).execute(getAccountsQuery, params);
    return rows
}

module.exports = { createAccount, createAccountUser, getAccounts, getAccountById }