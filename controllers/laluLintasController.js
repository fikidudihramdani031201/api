const db = require('../db/connection');
const path = require('path');
const upload = require('../middleware/upload');

const addLaluLintas = async (req, res) => {
  try {
    const { jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, nama_korban } = req.body;
    const imagePath = req.file ? req.file.path : null; // Mengambil file path dari req.file

    console.log('File path:', imagePath); // Log file path untuk debug

    if (!imagePath) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Gunakan placeholder PostgreSQL $1, $2, ...
    const result = await db.query(
      'INSERT INTO lalu_lintas (jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, nama_korban, gambar) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [jenis_kejadian, lokasi_kejadian, deskripsi, tanggal_kejadian, nias, nama_korban, imagePath]
    );

    const newId = result.rows[0].id;

    res.json({ msg: 'Data Lalu Lintas added successfully', id: newId });
  } catch (error) {
    console.error('Error adding Lalu Lintas data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getLaluLintas = async (req, res) => {
  try {
    // Gunakan TO_CHAR untuk format tanggal di PostgreSQL
    const result = await db.query(`
      SELECT
        id,
        jenis_kejadian,
        lokasi_kejadian,
        deskripsi,
        TO_CHAR(tanggal_kejadian, 'YYYY-MM-DD') AS tanggal_kejadian,
        nias,
        nama_korban,
        TO_CHAR(tanggal_disampaikan, 'YYYY-MM-DD') AS tanggal_disampaikan,
        gambar
      FROM lalu_lintas
    `);

  const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No data found' });
    }


    res.json(rows);
  } catch (error) {
    console.error('Error fetching Lalu Lintas data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addLaluLintas, getLaluLintas, upload };
