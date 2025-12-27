import mysql from "mysql2/promise"

declare global {
    var DB: mysql.Pool | undefined
}

const DB: mysql.Pool = global.DB ?? mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

if (!global.DB) {
  global.DB = DB;
}

export default DB