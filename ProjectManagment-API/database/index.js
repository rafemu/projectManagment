

const mysql2Promise = require("mysql2/promise")
const { DB_SCHEMA, DB_USER, DB_PASSWORD, DB_PORT, DB_HOST } = process.env;
console.log(DB_SCHEMA, DB_USER, DB_PASSWORD, DB_PORT, DB_HOST)

async function getConnection() {
    try {
        const connection = await mysql2Promise.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            multipleStatements: false,
            database: DB_SCHEMA,
            connectionLimit: 10
        });
        return connection;
    } catch (ex) {
        console.log("Failed connect to DB")
        console.log(ex.message)
    }

}

module.exports = getConnection