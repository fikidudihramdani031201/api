const jwt = require('jsonwebtoken');
const db = require('../db/connection'); // pastikan ini adalah koneksi ke PostgreSQL
const jwtSecret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query menggunakan placeholder $1, $2 untuk parameter
    const result = await db.query('SELECT id, username, role FROM users WHERE username = $1 AND password = $2', [username, password]);

    // Mengakses hasil query
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = rows[0];
    const payload = { user: { id: user.id, username: user.username, role: user.role } };

    // Menghasilkan token JWT
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server Error');
  }
};
