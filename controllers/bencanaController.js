const db = require('../db/connection');
const path = require('path');
const upload = require('../middleware/upload');

const getBencana = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        jenis_kejadian,
        lokasi_kejadian,
        deskripsi,
        TO_CHAR(tanggal_kejadian, 'YYYY-MM-DD') AS tanggal_kejadian,
        nias,
        TO_CHAR(tanggal_disampaikan, 'YYYY-MM-DD') AS tanggal_disampaikan,
        gambar
      FROM bencana
    `);

    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No data found' });
    }

    

    res.json(rows);
  } catch (error) {
    console.error('Error fetching Bencana data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addBencana = async (req, res) => {
  try {
    const { jenis_kejadian, lokasi_kejadian, deskripsi, nias, tanggal_kejadian } = req.body;
    const imagePath = req.file ? req.file.path : null;

    console.log('File path:', imagePath);

    if (!imagePath) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Pastikan menyesuaikan query dengan parameter placeholder PostgreSQL
    const result = await db.query(
      'INSERT INTO bencana (jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, gambar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, imagePath]
    );

    const newId = result.rows[0].id;

    res.json({ msg: 'Data Bencana added successfully', id: newId });
  } catch (error) {
    console.error('Error adding Bencana data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addBencana, getBencana, upload };
