const db = require('../db/connection');

// Add or update Firebase token for a user
const addOrUpdateToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    // Check if token already exists for this user
    const existingToken = await db.query(
      'SELECT id FROM firebase_tokens WHERE user_id = $1 AND token = $2',
      [userId, token]
    );

    if (existingToken.rows.length > 0) {
      return res.json({ msg: 'Token already exists for this user' });
    }

    // Insert new token
    await db.query(
      'INSERT INTO firebase_tokens (user_id, token) VALUES ($1, $2)',
      [userId, token]
    );

    res.json({ msg: 'Token added successfully' });
    console.log('sukses')
  } catch (error) {
    console.error('Error adding or updating token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove Firebase token
const removeToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    await db.query(
      'DELETE FROM firebase_tokens WHERE user_id = $1 AND token = $2',
      [userId, token]
    );

    res.json({ msg: 'Token removed successfully' });
  } catch (error) {
    console.error('Error removing token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get Firebase tokens for a user
const getTokensByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await db.query(
      'SELECT token FROM firebase_tokens WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows.map(row => row.token));
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addOrUpdateToken, removeToken, getTokensByUserId };
