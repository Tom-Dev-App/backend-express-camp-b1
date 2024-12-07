import mysql from 'mysql2/promise'
import 'dotenv/config'
const database = mysql.createPool( {
  host:   process.env.DATABASE_HOST ??'localhost',
  port:  process.env.DATABASE_PORT ?? 3306,
  user:  process.env.DATABASE_USERNAME ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? '',
  database:  process.env.DATABASE_NAME ??'celerates_camp_b1',
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