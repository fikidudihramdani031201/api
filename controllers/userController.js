const db = require('../db/connection');
const fs = require('fs');

// Fetch all members
exports.getMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT user_id, nias, nama, alamat, no_telpon, profile_picture FROM data_user');
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No members found' });
    }

    const members = rows.map(member => ({
      id: member.user_id,
      nias: member.nias,
      nama: member.nama,
      alamat: member.alamat,
      no_telpon: member.no_telpon,
      profile_picture: member.profile_picture,
    }));

    res.json(members);
  } catch (error) {
    console.error('Error while fetching members data:', error);
    res.status(500).send('Server Error');
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    const existingUsers = result.rows;

    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    const resultInsertUser = await db.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id', [username, password, role]);
    const newUserId = resultInsertUser.rows[0].id;
    const randomNias = generateRandomNias();

    await db.query('INSERT INTO data_user (user_id, nias, nama, alamat, no_telpon) VALUES ($1, $2, $3, $4, $5)', [newUserId, randomNias, '', '', 0 ]);

    res.json({ msg: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Generate a random NIAS number
function generateRandomNias() {
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
  return `7${randomDigits}`;
}

// Get total counts of disasters, kamtibmas, and traffic
exports.getTotalCounts = async (req, res) => {
  try {
    const disasterCountResult = await db.query('SELECT COUNT(*) AS total_disasters FROM bencana');
    const totalDisasters = parseInt(disasterCountResult.rows[0].total_disasters);

    const kamtibmasCountResult = await db.query('SELECT COUNT(*) AS total_kamtibmas FROM kamtibmas');
    const totalKamtibmas = parseInt(kamtibmasCountResult.rows[0].total_kamtibmas);

    const trafficCountResult = await db.query('SELECT COUNT(*) AS total_traffic FROM lalu_lintas');
    const totalTraffic = parseInt(trafficCountResult.rows[0].total_traffic);

    const totalCounts = {
      totalDisasters,
      totalKamtibmas,
      totalTraffic,
    };

    res.json(totalCounts);
  } catch (error) {
    console.error('Error fetching total counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Check user profile
exports.checkProfile = async (req, res) => {
  const { username, id, role } = req.user.user;

  res.json({ msg: `Welcome to your profile, ${username}!`, id, role });
};

// Get monthly data for disasters, kamtibmas, and traffic
exports.getMonthlyData = async (req, res) => {
  try {
    // Query for total disasters
    const disasterResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_disasters
      FROM bencana
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Query for total kamtibmas
    const kamtibmasResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_kamtibmas
      FROM kamtibmas
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Query for total traffic
    const trafficResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_traffic
      FROM lalu_lintas
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Combine results into a single response object
    const response = {
      totalDisasters: disasterResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_disasters) })),
      totalKamtibmas: kamtibmasResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_kamtibmas) })),
      totalTraffic: trafficResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_traffic) }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Data profile for statistics
exports.dataProfile = async (req, res) => {
  try {
    // Query for total disasters
    const disasterResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_disasters
      FROM bencana
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Query for total kamtibmas
    const kamtibmasResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_kamtibmas
      FROM kamtibmas
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Query for total traffic
    const trafficResult = await db.query(`
      SELECT
        TO_CHAR(tanggal_kejadian, 'YYYY-MM') AS month,
        COUNT(*) AS total_traffic
      FROM lalu_lintas
      WHERE tanggal_kejadian >= CURRENT_DATE - INTERVAL '5 months'
      GROUP BY month
      ORDER BY month;
    `);

    // Combine results into a single response object
    const response = {
      totalDisasters: disasterResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_disasters) })),
      totalKamtibmas: kamtibmasResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_kamtibmas) })),
      totalTraffic: trafficResult.rows.map(row => ({ month: row.month, count: parseInt(row.total_traffic) }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await db.query('SELECT username, password, role FROM users WHERE id = $1', [userId]);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error while fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
