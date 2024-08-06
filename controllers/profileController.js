const db = require('../db/connection');
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/imageUpload'); // Import middleware upload

const getProfile = async (req, res) => {
  const userId = req.user.user.id;

  try {
    // Query dengan parameter placeholder $1
    const result = await db.query('SELECT user_id, nias, nama, profile_picture, alamat, no_telpon FROM data_user WHERE user_id = $1', [userId]);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const userProfile = rows[0];
    const response = {
      id: userProfile.user_id,
      nias: userProfile.nias,
      nama: userProfile.nama,
      alamat: userProfile.alamat,
      no_telpon: userProfile.no_telpon,
      profile_picture: userProfile.profile_picture,
    };
    res.json(response);
  } catch (error) {
    console.error('Error while fetching user profile data:', error);
    res.status(500).send('Server Error');
  }
};

const uploadProfilePicture = async (req, res) => {
  const userId = req.user.user.id;

  try {
    // Query untuk mendapatkan profile_picture lama
    const result = await db.query('SELECT profile_picture FROM data_user WHERE user_id = $1', [userId]);
    const oldProfilePicturePath = result.rows[0]?.profile_picture;

    const filePath = req.file.path;
    // Update path gambar di database
    await db.query('UPDATE data_user SET profile_picture = $1 WHERE user_id = $2', [filePath, userId]);

    if (oldProfilePicturePath) {
      // Hapus gambar lama jika ada
      fs.unlink(oldProfilePicturePath, (unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting old profile picture:', unlinkError);
        } else {
          console.log('Old profile picture deleted successfully');
        }
      });
    }

    res.json({ msg: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('Server Error');
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user.user.id;
  const { nama, alamat, no_telpon, nias } = req.body;

  try {
    const existingNias = req.user.user.nias;

    await db.query('BEGIN'); // Memulai transaksi

    await db.query('UPDATE data_user SET nama = $1, alamat = $2, no_telpon = $3, nias = $4 WHERE user_id = $5', [nama, alamat, no_telpon, nias, userId]);
    await db.query('UPDATE kamtibmas SET nias = $1 WHERE nias = $2', [nias, existingNias]);

    await db.query('COMMIT'); // Mengonfirmasi transaksi

    res.json({ msg: 'User data updated successfully' });
  } catch (error) {
    await db.query('ROLLBACK'); // Membatalkan transaksi
    console.error('Error during user data update:', error);
    res.status(500).send('Server Error');
  }
};

const deleteMember = async (req, res) => {
  const userId = req.params.id;

  try {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ msg: 'User has been deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server Error');
  }
};

const getProfilePicture = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query('SELECT profile_picture FROM data_user WHERE user_id = $1', [userId]);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const picturePath = rows[0].profile_picture;

    if (!fs.existsSync(picturePath)) {
      return res.status(404).json({ msg: 'Profile picture not found' });
    }

    res.sendFile(path.resolve(picturePath));
  } catch (error) {
    console.error('Error while fetching profile picture:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { getProfile, uploadProfilePicture, updateProfile, getProfilePicture, deleteMember, upload };
