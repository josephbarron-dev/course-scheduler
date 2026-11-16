const mysql = require('mysql2/promise')
require('dotenv').config()

// One shared pool for the whole app. Routes import this instead of opening their own connections.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    // Keep idle connections alive so the remote class server doesn't drop them
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    idleTimeout: 60000,
})

module.exports = pool
