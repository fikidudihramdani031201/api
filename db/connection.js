// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME || 'sriti',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });

// module.exports = db;


const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // ini akan menerima sertifikat self-signed
  }
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to PG:', err);
    } else {
      console.log('Connected to PG database');
    }
  });

module.exports = db;
