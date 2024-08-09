const db = require('../db/connection'); // Koneksi ke database

// Fungsi untuk mengambil token dari database
const getTokensFromDatabase = async () => {
  try {
    const result = await db.query('SELECT token FROM firebase_tokens');
    return result.rows.map(row => row.token); // Ambil token dari hasil query
  } catch (error) {
    console.error('Error fetching tokens from database:', error);
    throw new Error('Failed to fetch tokens from database');
  }
};

module.exports = { getTokensFromDatabase };
