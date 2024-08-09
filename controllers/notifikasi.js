const { sendNotificationService } = require('../controllers/firebaseSendController');
const { getTokensFromDatabase } = require('../models/tokenModel'); 

const sendNotification = async (req, res) => {
  const { message, senderToken } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Pesan harus diisi.' });
  }

  try {
    await sendNotificationService(message, senderToken);
    res.status(200).json({ message: 'Notifikasi berhasil dikirim' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Gagal mengirim notifikasi' });
  }
};

module.exports = { sendNotification };


