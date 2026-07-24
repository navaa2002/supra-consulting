/**
 * MySQL connection pool.
 *
 * A pool (instead of the old single `mysql.createConnection`) is used so the
 * API survives idle timeouts / dropped connections instead of crashing the
 * whole server the first time MySQL closes an inactive connection.
 *
 * We use the `mysql2/promise` API so every route can simply `await` a query
 * instead of nesting callbacks.
 */
const mysql = require("mysql2/promise");

// Hosted MySQL-compatible services used for production (TiDB Cloud,
// PlanetScale, Aiven, etc.) require TLS. Local MySQL doesn't, so this is
// opt-in via DB_SSL=true in the environment rather than always-on.
const useSsl = process.env.DB_SSL === "true";

const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  charset: "utf8mb4",
  ...(useSsl ? { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true } } : {}),
});

// Fail fast (but don't crash) on startup if the DB is unreachable, so the
// developer sees a clear message instead of cryptic errors on first request.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("[db] MySQL connected:", process.env.DB_NAME || "supra_db");
    conn.release();
  } catch (err) {
    console.error("[db] MySQL connection failed:", err.message);
    console.error(
      "[db] Check backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and that the schema has been imported (backend/db/schema.sql)."
    );
  }
}

module.exports = { pool, testConnection };
