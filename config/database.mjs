import mysql from 'mysql2/promise'

const database = mysql.createPool( {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'celerates_camp_b1',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
} )

database
  .getConnection()
      .then(() => console.log(`Connected to the database`))
      .catch((err) => console.error(`Connection to database FAILED! ${err}`));

export default database