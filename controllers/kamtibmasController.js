const db = require('../db/connection');
const path = require('path');
const upload = require('../middleware/upload');

const addKamtibmas = async (req, res) => {
  try {
    const { nama_korban, jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias } = req.body;
    const filePath = req.file ? req.file.path : null;

    // Gunakan placeholder PostgreSQL $1, $2, ...
    const result = await db.query(
      'INSERT INTO kamtibmas (nama_korban, jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, gambar) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [nama_korban, jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, filePath]
    );

    const newId = result.rows[0].id;

    res.json({ msg: 'Data Kamtibmas added successfully', id: newId });
  } catch (error) {
    console.error('Error adding Kamtibmas data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getKamtibmas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        nama_korban,
        jenis_kejadian,
        lokasi_kejadian,
        deskripsi,
        TO_CHAR(tanggal_kejadian, 'YYYY-MM-DD') AS tanggal_kejadian,
        nias,
        TO_CHAR(tanggal_disampaikan, 'YYYY-MM-DD') AS tanggal_disampaikan,
        gambar
      FROM kamtibmas
    `);

    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No data found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching Kamtibmas data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addKamtibmas, getKamtibmas, upload };
